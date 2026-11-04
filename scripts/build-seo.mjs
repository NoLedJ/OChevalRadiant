import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'dist/ocheval-radiant/browser';
const pages = JSON.parse(await readFile('src/app/seo-pages.json', 'utf8'));
const origin = 'https://ochevalradiant.com';
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const shell = await readFile(join(root, 'index.html'), 'utf8');
// Keep Angular's stylesheet noscript fallbacks; remove only the Contact content.
const genericShell = shell.replace(/^[ \t]*<noscript>\s*<section aria-labelledby="contact-without-js"[\s\S]*?<\/noscript>\r?\n/m, '');
await mkdir(join(root, '_seo'), { recursive: true });
for (const [path, page] of Object.entries(pages)) {
  const url = origin + (path ? '/' + path : '/');
  const html = (path === 'contact' ? shell : genericShell)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escape(page.description)}">`)
    .replace('</head>', `<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow">
<meta property="og:title" content="${escape(page.title)}">
<meta property="og:description" content="${escape(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
</head>`);
  await writeFile(join(root, path ? `_seo/${path}.html` : 'index.html'), html);
}
await writeFile(join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(pages).map(path => `  <url><loc>${origin}${path ? '/' + path : '/'}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`SEO: ${Object.keys(pages).length} HTML heads, robots.txt and sitemap.xml generated (static CSR).`);
