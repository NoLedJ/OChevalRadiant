// Snapshot the actual compiled Angular error route. No duplicated templates or CSS.
// Chrome is already required by test:ci; no browser package or server runtime added.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, extname, join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';

const root = resolve('dist/ocheval-radiant/browser');
const chrome = [process.env.CHROME_BIN,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
  '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].find(path => path && existsSync(path));
if (!chrome) throw new Error('Chrome is required to generate 404.html; set CHROME_BIN (as for test:ci).');

let shell = await readFile(join(root, 'index.html'), 'utf8');
// The 404 already has a rendered no-JS page; omit the CSR shell's contact fallback.
shell = shell.replace(/^[ \t]*<noscript>\s*<section aria-labelledby="contact-without-js"[\s\S]*?<\/noscript>\r?\n/m, '');
// Embed the exact compiled global stylesheet so even a missing CSS request can
// display a fully styled error document. Component styles come from Angular.
for (const match of shell.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)) {
  const href = match[0].match(/href="([^"]+)"/)?.[1];
  if (!href || basename(href) !== href) throw new Error('Unexpected stylesheet path in Angular output.');
  const css = await readFile(join(root, href), 'utf8');
  shell = shell.replace(match[0], `<style data-shared-styles="${href}">${css}</style>`);
}
shell = shell.replace('</body>', `<script id="snapshot-readiness">
(async () => {
  for (let i = 0; i < 100; i++) {
    if (document.querySelector('app-not-found h1') && document.querySelector('app-footer footer') && document.querySelector('#site-navigation')) {
      await document.fonts.ready;
      document.documentElement.setAttribute('data-error-snapshot', 'ready');
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
})();
</script></body>`);

const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript',
  '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/__error_snapshot__') {
      response.writeHead(200, { 'Content-Type': mime['.html'] }).end(shell);
      return;
    }
    const file = resolve(root, '.' + pathname);
    if (!file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' }).end(data);
  } catch { response.writeHead(404).end(); }
});
const profile = await mkdtemp(join(tmpdir(), 'ocheval-404-'));
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/__error_snapshot__`;
  const html = await new Promise((resolve, reject) => {
    const child = spawn(chrome, ['--headless', '--dump-dom', '--virtual-time-budget=10000',
      '--timeout=20000', '--no-first-run', '--no-default-browser-check',
      '--disable-background-networking', `--user-data-dir=${profile}`, url], { windowsHide: true });
    let stdout = '', stderr = '';
    const timer = setTimeout(() => { child.kill(); reject(new Error('404 rendering timed out.')); }, 30000);
    child.stdout.on('data', data => { stdout += data; });
    child.stderr.on('data', data => { stderr += data; });
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => {
      clearTimeout(timer);
      if (code !== 0) reject(new Error(`Chrome exited ${code}: ${stderr.slice(-2000)}`));
      else resolve(stdout);
    });
  });
  if (!html.includes('data-error-snapshot="ready"') || !html.includes('noindex, follow') ||
      html.includes('rel="canonical"') || (html.match(/<header\b/g) ?? []).length !== 1 ||
      (html.match(/<footer\b/g) ?? []).length !== 1 || !html.includes('app-action-link')) {
    throw new Error('Incomplete Angular 404 snapshot; refusing to publish a partial fallback.');
  }
  const output = html.replace(/ data-error-snapshot="ready"/, '')
    .replace(/<script id="snapshot-readiness">[\s\S]*?<\/script>/, '')
    .replace(/<!DOCTYPE html>/i, '<!doctype html>\n<!-- Generated from the real Angular build by scripts/build-404.mjs. Do not edit. -->');
  // Module scripts remain: normal CSR resumes when JS is available. With JS off,
  // the same rendered components and native menu/links remain fully usable.
  await writeFile(join(root, '404.html'), output);
  await writeFile('public/404.html', output);
  console.log('404: actual App/Header/NotFound/Footer and compiled styles captured; no design copy.');
} finally {
  await new Promise(resolve => server.close(resolve));
  const safeProfile = resolve(profile);
  if (!safeProfile.startsWith(resolve(tmpdir()) + sep) || !basename(safeProfile).startsWith('ocheval-404-')) {
    throw new Error('Unexpected temporary Chrome profile path.');
  }
  await rm(safeProfile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
