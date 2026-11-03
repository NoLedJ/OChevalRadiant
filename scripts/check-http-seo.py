"""Read-only checks against a local Apache serving the production build.
Usage: python scripts/check-http-seo.py --http http://127.0.0.1:4390 --https https://127.0.0.1:4391 --ca ../localhost.crt
"""
import argparse
import hashlib
import json
import ssl
import urllib.error
import urllib.parse
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
parser.add_argument('--root', default='dist/ocheval-radiant/browser')
parser.add_argument('--front-http', help='Local fixture simulating an HTTPS redirect before .htaccess')
parser.add_argument('--fixture-env', action='store_true', help='Local-only SetEnvIf fixture enabled')
args = parser.parse_args()
context = ssl.create_default_context(cafile=args.ca)
opener = urllib.request.build_opener(NoRedirect, urllib.request.HTTPSHandler(context=context))
pages = json.loads(Path('src/app/seo-pages.json').read_text(encoding='utf-8'))
checks = []

def get(path, tls=False, host=None, extra=None, method='GET', front=False):
    headers = {'Accept-Encoding': 'identity'}
    if host: headers['Host'] = host
    headers.update(extra or {})
    endpoint = args.front_http if front else (args.https if tls else args.http)
    request = urllib.request.Request(endpoint + path, headers=headers, method=method)
    try: response = opener.open(request, timeout=20)
    except urllib.error.HTTPError as error: response = error
    with response:
        data = response.read()
        checks.append({'path': path, 'tls': tls, 'host': host, 'method': method, 'front': front, 'status': response.status})
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
    status, headers, body = get(url, tls=True, host='ochevalradiant.com', method='HEAD')
    assert status == 200 and not body and 'Location' not in headers, path

root = Path(args.root)
error_document = (root / '404.html').read_bytes()
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
error_paths = ['/inconnue', '/inconnue/', '/contact/sous-page', '/chemin/tres/profond?x=1',
               '/main-absent.js', '/styles-absent.css', '/images/absente.webp', '/fonts/absente.woff2',
               '/404.html/absente', '/_seo/contact.html', '/_seo/', '/_SEO/contact.html',
               '/%5fseo/contact.html', '/inconnue%20encodee?x=%2F', '/introuvable.xml']

def check_error(path, tls=False, method='GET', extra=None):
    status, headers, body = get(path, tls=tls, method=method, extra=extra)
    assert status == 404 and 'Location' not in headers, (path, status, headers)
    assert headers['Content-Type'].startswith('text/html') and 'no-store' in headers['Cache-Control'], path
    if method == 'HEAD':
        assert not body, path
    else:
        assert body == error_document, path
        assert Head(body.decode('utf-8')).meta['robots'] == 'noindex, follow', path

for path in error_paths:
    for tls in [False, True]:
        for method in ['GET', 'HEAD']:
            check_error(path, tls, method)
# A handler is a terminal static resource: a direct request does not manufacture an error.
for tls in [False, True]:
    for method in ['GET', 'HEAD']:
        status, headers, body = get('/404.html?direct=1', tls=tls, method=method)
        assert status == 200 and 'Location' not in headers and 'no-store' in headers['Cache-Control']
        assert body == (error_document if method == 'GET' else b'')
assert error_head.meta['robots'] == 'noindex, follow'
# Repeat the original failure path and an actual error; state must not leak between requests.
for _ in range(3):
    assert get('/404.html', tls=True)[0] == 200
    check_error('/inconnue?repeat=1', tls=True)

# Fault injection is in the local server config only, never in the shipped .htaccess.
if args.fixture_env:
    for value in ['0', '200', '404']:
        extra = {'X-Seo-Test-Redirect-Status': value}
        for tls in [False, True]:
            status, headers, body = get('/404.html', tls=tls, extra=extra)
            assert headers['X-Seo-Test-Observed-Status'] == value, headers
            assert status == 200 and body == error_document
            check_error('/inconnue?injected=' + value, tls=tls, extra=extra)
for path in ['/contact?x=1', '/inconnue?x=1']:
    for tls, host in [(False, 'ochevalradiant.com'), (False, 'www.ochevalradiant.com'), (True, 'www.ochevalradiant.com')]:
        status, headers, _ = get(path, tls=tls, host=host)
        assert status == 301 and headers['Location'] == 'https://ochevalradiant.com' + path, (path, headers)
status, _, _ = get('/contact', host='ochevalradiant.com', extra={'X-Forwarded-Proto': 'https'})
assert status == 301  # Untrusted client headers cannot bypass HTTPS.
status, _, _ = get('/contact', tls=True, host='ochevalradiant.com', extra={'X-Forwarded-Proto': 'http'})
assert status == 200  # Nor can they force a loop on a real TLS connection.
status, headers, _ = get('/index.html?x=1')
assert status == 301 and headers['Location'].endswith('/?x=1')

def check_chain(path, tls, host, expected_status, expected_path, front=False):
    """Follow at most four hops, always remapping production names to LOCAL listeners."""
    visited = set()
    for _ in range(5):
        key = (tls, host, path, front)
        assert key not in visited, ('redirect loop', key)
        visited.add(key)
        status, headers, body = get(path, tls=tls, host=host, front=front)
        if status not in [301, 302, 307, 308]:
            assert status == expected_status and path == expected_path and tls
            assert host == 'ochevalradiant.com' and 'Location' not in headers
            if status == 404: assert body == error_document
            return
        assert status == 301, (path, status)
        origin = ('https' if tls else 'http') + '://' + host
        target = urllib.parse.urlsplit(urllib.parse.urljoin(origin + path, headers['Location']))
        assert target.scheme in ['http', 'https'] and target.hostname in ['ochevalradiant.com', 'www.ochevalradiant.com']
        assert not target.port and not target.username and not target.password and not target.fragment
        # Canonicalization must not lose campaign parameters or encode them twice.
        assert target.query == urllib.parse.urlsplit(path).query
        assert not tls or target.scheme == 'https', 'TLS downgrade'
        tls, host = target.scheme == 'https', target.hostname
        path = target.path + ('?' + target.query if target.query else '')
        front = False
    raise AssertionError(('too many redirects', visited))

for path, expected, final in [('/contact/?x=%2F&y=1', 200, '/contact?x=%2F&y=1'),
                              ('/index.html?x=1', 200, '/?x=1'),
                              ('/inconnue?x=%2F', 404, '/inconnue?x=%2F'),
                              ('/main-absent.js?x=1', 404, '/main-absent.js?x=1'),
                              ('/404.html?x=1', 200, '/404.html?x=1')]:
    for tls in [False, True]:
        for host in ['ochevalradiant.com', 'www.ochevalradiant.com']:
            check_chain(path, tls, host, expected, final)
    if args.front_http:
        for host in ['ochevalradiant.com', 'www.ochevalradiant.com']:
            check_chain(path, False, host, expected, final, front=True)
status, headers, body = get('/robots.txt')
assert status == 200 and headers['Content-Type'].startswith('text/plain')
assert b'Sitemap: https://ochevalradiant.com/sitemap.xml' in body and b'Disallow: /' not in body
status, headers, body = get('/sitemap.xml')
assert status == 200 and 'xml' in headers['Content-Type']
urls = [node.text for node in ET.fromstring(body).findall('{*}url/{*}loc')]
assert urls == ['https://ochevalradiant.com/' + path for path in pages]

# Every public asset must still be served byte-for-byte, not as an HTML fallback.
asset_count = 0
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
