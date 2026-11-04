# OchevalRadiant

Open your browser and navigate to https://ochevalradiant.com to browse the project on production.
This statically hosted CSR application uses Angular 22. See the [SEO v1.2.0 report](docs/seo.md) for routing, metadata, the generated 404, validation and Hostinger limitations.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm run build -- --configuration production
```

The complete artifact is in `dist/ocheval-radiant/browser`, including `.htaccess`, 13 page-specific HTML heads, robots.txt, sitemap.xml and 404.html. Chrome must be installed (set `CHROME_BIN` when needed) to generate the 404 from the actual Angular components. Direct `ng build`, `ng serve` and the development watch command do not run this SEO post-processing. No SSR server is required in production.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm run typecheck
npm run test:ci
```

## Running end-to-end tests

The mobile menu has a Playwright suite covering short viewports, keyboard/focus,
native popover behavior, scrolling, safe areas, zoom and desktop navigation.
With Chrome and Edge installed:

```bash
npx playwright install webkit
npm run test:e2e
```

The Ubuntu PR workflow runs Chrome and WebKit and archives the browser report.
Edge is covered locally. The three Chromium-specific probes (native browser zoom,
safe-area overrides and injected touch drags) are excluded on WebKit; see the
[mobile menu validation report](docs/mobile-menu-validation.md) for exact coverage,
screenshots and remaining Safari/iOS limits.

The PR workflow also runs the HTTP/HTTPS routing recipe under Apache on Ubuntu.
To reproduce that recipe with Apache/OpenSSL installed and a completed build:

```bash
bash scripts/check-http-seo.sh
```

This starts only a temporary loopback Apache instance, validates the artifact, and stops that instance. It does not access Hostinger or deploy the site.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
