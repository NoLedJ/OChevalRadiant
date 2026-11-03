import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import pages from './seo-pages.json';

export const SITE_ORIGIN = 'https://ochevalradiant.com';

@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    while (route.firstChild) route = route.firstChild;
    const path = route.routeConfig?.path;
    const page = path !== undefined && Object.hasOwn(pages, path)
      ? pages[path as keyof typeof pages] : undefined;
    const title = page?.title ?? 'Page introuvable | Ô Cheval Radiant';
    const description = page?.description ?? 'Cette page est introuvable. Retrouvez les pages de l’association Ô Cheval Radiant depuis l’accueil.';
    this.document.documentElement.lang = 'fr';
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: page ? 'index, follow' : 'noindex, follow' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'fr_FR' });
    this.document.querySelectorAll('link[rel="canonical"]').forEach(link => link.remove());
    if (page) {
      const canonical = SITE_ORIGIN + (path ? '/' + path : '/');
      const link = this.document.createElement('link');
      link.rel = 'canonical';
      link.href = canonical;
      this.document.head.append(link);
      this.meta.updateTag({ property: 'og:url', content: canonical });
    } else {
      this.meta.removeTag('property="og:url"');
    }
  }
}
