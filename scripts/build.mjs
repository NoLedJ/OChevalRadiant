import { spawnSync } from 'node:child_process';

// Forward npm build arguments to Angular, not to the SEO post-processing script.
const result = spawnSync(process.execPath, [
  'node_modules/@angular/cli/bin/ng.js', 'build', ...process.argv.slice(2)
], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
await import('./build-seo.mjs');
await import('./build-404.mjs');
