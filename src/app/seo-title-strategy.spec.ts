import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { provideRouter, Router, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import pages from './seo-pages.json';
import { SeoTitleStrategy } from './seo-title-strategy';

describe('SEO navigation', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [
    provideRouter(routes), { provide: TitleStrategy, useClass: SeoTitleStrategy }
  ] }));

  afterEach(() => {
    const document = TestBed.inject(DOCUMENT);
    document.querySelectorAll('link[rel="canonical"], meta[property^="og:"], meta[name="robots"]').forEach(node => node.remove());
  });

  for (const [path, page] of Object.entries(pages)) {
    it(`sets French metadata and a single canonical for /${path}`, async () => {
      await TestBed.inject(Router).navigateByUrl('/' + path + '?utm_source=test#section');
      const document = TestBed.inject(DOCUMENT);
      expect(document.documentElement.lang).toBe('fr');
      expect(document.title).toBe(page.title);
      expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(page.description);
      expect(document.querySelectorAll('link[rel="canonical"]').length).toBe(1);
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://ochevalradiant.com' + (path ? '/' + path : '/'));
      expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('index, follow');
      expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(page.title);
    });
  }

  it('clears stale canonical and noindexes unknown routes, then restores known metadata', async () => {
    const router = TestBed.inject(Router);
    const document = TestBed.inject(DOCUMENT);
    await router.navigateByUrl('/contact');
    await router.navigateByUrl('/inconnue');
    expect(document.title).toContain('Page introuvable');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, follow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('meta[property="og:url"]')).toBeNull();
    await router.navigateByUrl('/a-propos');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('index, follow');
    expect(document.querySelectorAll('link[rel="canonical"]').length).toBe(1);
    expect(document.title).toBe(pages['a-propos'].title);
  });
});
