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

There is no configured `ng e2e` runner. The PR workflow runs the HTTP/HTTPS routing recipe under Apache on Ubuntu; the browser checks and remaining compatibility limits are documented in the SEO report. To reproduce the HTTP recipe on Ubuntu with Apache/OpenSSL installed and a completed build:

```bash
bash scripts/check-http-seo.sh
```

This starts only a temporary loopback Apache instance, validates the artifact, and stops that instance. It does not access Hostinger or deploy the site.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
