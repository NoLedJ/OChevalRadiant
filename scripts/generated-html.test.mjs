// Integration tests against the real production output; run after npm run build.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = 'dist/ocheval-radiant/browser';
const html = path => readFile(`${root}/${path}`, 'utf8');
const contactFallback = /<noscript>\s*<section aria-labelledby="contact-without-js"[\s\S]*?<\/noscript>/g;

test('Contact contains native no-JS contact details and an explicit Maps link', async () => {
  const page = await html('_seo/contact.html');
  const blocks = [...page.matchAll(contactFallback)];
  assert.equal(blocks.length, 1);
  const fallback = blocks[0][0];
  assert.match(fallback, /1 Chemin de la Rosière, 59550 Maroilles, France/);
  assert.match(fallback, /href="tel:\+33663457173"/);
  assert.match(fallback, /href="mailto:ochevalradiant@gmail.com"/);
  assert.match(fallback, /<a href="https:\/\/www\.google\.com\/maps\/search\/[^\"]+" target="_blank" rel="noopener noreferrer">Ouvrir Ô Cheval Radiant dans Google Maps \(nouvel onglet\)<\/a>/);
  assert.doesNotMatch(page, /<iframe\b|<script[^>]+src="https:\/\/|<link[^>]+rel="(?:preconnect|dns-prefetch)"/);
});

for (const [name, path] of [['home', 'index.html'], ['team', '_seo/equipe.html']]) {
  test(`${name} has no Contact-specific no-JS content`, async () => {
    const page = await html(path);
    assert.doesNotMatch(page, /contact-without-js|Ô Cheval Radiant — Contact|href="tel:\+33663457173"/);
    assert.match(page, /<app-root><\/app-root>/);
  });
}

test('404 preserves its rendered native error page without the Contact fallback', async () => {
  const page = await html('404.html');
  assert.doesNotMatch(page, /contact-without-js|Ô Cheval Radiant — Contact|snapshot-readiness|rel="canonical"/);
  assert.match(page, /<app-not-found\b/);
  assert.match(page, /<h1\b[^>]*>[\s\S]*?<\/h1>/);
  assert.match(page, /<a\b[^>]*href="\/"/);
  assert.match(page, /content="noindex, follow"/);
  assert.equal((page.match(/<header\b/g) ?? []).length, 1);
  assert.equal((page.match(/<footer\b/g) ?? []).length, 1);
});

test('all 13 routes keep their SEO metadata and only Contact has the fallback', async () => {
  const pages = JSON.parse(await readFile('src/app/seo-pages.json', 'utf8'));
  assert.equal(Object.keys(pages).length, 13);
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  for (const [path, metadata] of Object.entries(pages)) {
    const page = await html(path ? `_seo/${path}.html` : 'index.html');
    const url = `https://ochevalradiant.com/${path}`;
    assert.equal(page.includes('contact-without-js'), path === 'contact', path);
    assert.ok(page.includes(`<title>${escape(metadata.title)}</title>`), path);
    assert.ok(page.includes(`<meta name="description" content="${escape(metadata.description)}">`), path);
    assert.ok(page.includes(`<link rel="canonical" href="${url}">`), path);
    assert.ok(page.includes('<meta name="robots" content="index, follow">'), path);
    for (const [property, value] of Object.entries({title:metadata.title, description:metadata.description, url, type:'website', locale:'fr_FR'})) {
      assert.ok(page.includes(`<meta property="og:${property}" content="${escape(value)}">`), `${path}: og:${property}`);
    }
  }
});
