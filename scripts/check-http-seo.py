"""Read-only checks against a local Apache serving the production build.
Usage: python scripts/check-http-seo.py --http http://127.0.0.1:4390 --https https://127.0.0.1:4391 --ca ../localhost.crt
"""
import argparse
import hashlib
import json
import ssl
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

class Head(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.lang = None
        self.title = ''
        self.in_title = False
        self.meta = {}
        self.canonicals = []
        self.tags = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == 'html': self.lang = attrs.get('lang')
        if tag == 'title': self.in_title = True
        if tag == 'meta': self.meta[attrs.get('name', attrs.get('property'))] = attrs.get('content')
        if tag == 'link' and attrs.get('rel') == 'canonical': self.canonicals.append(attrs.get('href'))

    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False

    def handle_data(self, data):
        if self.in_title: self.title += data

parser = argparse.ArgumentParser()
parser.add_argument('--http', required=True)
parser.add_argument('--https', required=True)
parser.add_argument('--ca', required=True)
args = parser.parse_args()
context = ssl.create_default_context(cafile=args.ca)
opener = urllib.request.build_opener(NoRedirect, urllib.request.HTTPSHandler(context=context))
pages = json.loads(Path('src/app/seo-pages.json').read_text(encoding='utf-8'))
checks = []

def get(path, tls=False, host=None, extra=None, method='GET'):
    headers = {'Accept-Encoding': 'identity'}
    if host: headers['Host'] = host
    headers.update(extra or {})
    request = urllib.request.Request((args.https if tls else args.http) + path, headers=headers, method=method)
    try: response = opener.open(request, timeout=20)
    except urllib.error.HTTPError as error: response = error
    with response:
        data = response.read()
        checks.append({'path': path, 'tls': tls, 'host': host, 'method': method, 'status': response.status})
        return response.status, response.headers, data

for path, page in pages.items():
    url = '/' + path
    status, headers, body = get(url + '?utm_source=test')
    head = Head(body.decode('utf-8'))
    canonical = 'https://ochevalradiant.com' + url
    assert status == 200 and head.lang == 'fr', path
    assert head.title == page['title'] and head.meta['description'] == page['description'], path
    assert head.canonicals == [canonical] and head.meta['og:url'] == canonical, path
    assert head.meta['robots'] == 'index, follow' and 'no-store' in headers['Cache-Control'], path
    if path:
        status, headers, _ = get(url + '/')
        assert status == 301 and headers['Location'].endswith(url), (path, headers)
    status, _, _ = get(url, tls=True, host='ochevalradiant.com')
    assert status == 200, path

error_document = Path('public/404.html').read_bytes()
error_head = Head(error_document.decode('utf-8'))
assert error_head.lang == 'fr' and error_head.canonicals == []
assert [tag for tag, _ in error_head.tags].count('header') == 1
assert [tag for tag, _ in error_head.tags].count('footer') == 1
assert any(tag == 'app-header' for tag, _ in error_head.tags)
assert any(tag == 'app-footer' for tag, _ in error_head.tags)
assert any(tag == 'app-action-link' for tag, _ in error_head.tags)
assert any(tag == 'base' and attrs.get('href') == '/' for tag, attrs in error_head.tags)
assert any(tag == 'a' and attrs.get('class') == 'button contact-button text-sm' and attrs.get('href') == '/' for tag, attrs in error_head.tags)
assert 'not-found__eyebrow' not in error_document.decode('utf-8')
assert any(tag == 'div' and attrs.get('id') == 'site-navigation' and attrs.get('popover') == 'auto' for tag, attrs in error_head.tags)
for path in ['/404.html', '/inconnue', '/contact/sous-page', '/chemin/tres/profond?x=1', '/main-absent.js', '/styles-absent.css', '/images/absente.webp', '/fonts/absente.woff2', '/_seo/contact.html', '/%5fseo/contact.html']:
    for tls in [False, True]:
        status, headers, body = get(path, tls=tls)
        assert status == 404 and body == error_document, path
        assert Head(body.decode('utf-8')).meta['robots'] == 'noindex, follow', path
        assert headers['Content-Type'].startswith('text/html') and 'no-store' in headers['Cache-Control'], path
for path, expected in [('/contact', 200), ('/404.html', 404), ('/main-absent.js', 404)]:
    status, _, body = get(path, method='HEAD')
    assert status == expected and not body, path
for path in ['/contact?x=1', '/inconnue?x=1']:
    for tls, host in [(False, 'ochevalradiant.com'), (False, 'www.ochevalradiant.com'), (True, 'www.ochevalradiant.com')]:
        status, headers, _ = get(path, tls=tls, host=host)
        assert status == 301 and headers['Location'] == 'https://ochevalradiant.com' + path, (path, headers)
status, _, _ = get('/contact', host='ochevalradiant.com', extra={'X-Forwarded-Proto': 'https'})
assert status == 301  # Untrusted client headers cannot bypass HTTPS.
status, headers, _ = get('/index.html?x=1')
assert status == 301 and headers['Location'].endswith('/?x=1')
status, headers, body = get('/robots.txt')
assert status == 200 and headers['Content-Type'].startswith('text/plain')
assert b'Sitemap: https://ochevalradiant.com/sitemap.xml' in body and b'Disallow: /' not in body
status, headers, body = get('/sitemap.xml')
assert status == 200 and 'xml' in headers['Content-Type']
urls = [node.text for node in ET.fromstring(body).findall('{*}url/{*}loc')]
assert urls == ['https://ochevalradiant.com/' + path for path in pages]

# Every public asset must still be served byte-for-byte, not as an HTML fallback.
asset_count = 0
root = Path('dist/ocheval-radiant/browser')
for file in root.rglob('*'):
    rel = file.relative_to(root).as_posix()
    if not file.is_file() or rel.startswith('_seo/') or rel in ['.htaccess', 'index.html', '404.html']:
        continue
    status, _, body = get('/' + urllib.parse.quote(rel, safe='/'))
    assert status == 200 and hashlib.sha256(body).digest() == hashlib.sha256(file.read_bytes()).digest(), rel
    asset_count += 1
status, _, _ = get('/.htaccess')
assert status == 403
print(json.dumps({'passed': len(checks), 'assets_checked': asset_count, 'checks': checks}, ensure_ascii=False, indent=2))
