import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { provideRouter, Router, TitleStrategy } from '@angular/router';
import { App } from '../../../app';
import { routes } from '../../../app.routes';
import { SeoTitleStrategy } from '../../../seo-title-strategy';

describe('Branded unknown route', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), { provide: TitleStrategy, useClass: SeoTitleStrategy }]
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(DOCUMENT).querySelectorAll('link[rel="canonical"], meta[property^="og:"], meta[name="robots"]').forEach(node => node.remove());
  });

  it('uses the real site layout once and focuses the error heading', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/chemin/inconnu');
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('header').length).toBe(1);
    expect(element.querySelectorAll('footer').length).toBe(1);
    const heading = element.querySelector('main h1');
    expect(heading?.textContent).toBe('Page introuvable');
    expect(TestBed.inject(DOCUMENT).activeElement).toBe(heading);
    expect(element.querySelector('main img')?.getAttribute('alt')).toBeTruthy();
    expect(element.querySelector('.not-found__eyebrow')).toBeNull();
    expect(element.querySelector('app-action-link a.button')).not.toBeNull();
  });

  it('returns home through Angular and restores indexable metadata', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/introuvable');
    await fixture.whenStable();
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('.not-found__home a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/');
    link.click();
    await fixture.whenStable();
    expect(router.url).toBe('/');
    expect(fixture.nativeElement.querySelector('app-not-found')).toBeNull();
    expect(TestBed.inject(DOCUMENT).querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('index, follow');
    expect(TestBed.inject(DOCUMENT).querySelectorAll('link[rel="canonical"]').length).toBe(1);
  });
});
