import import_a_propos_text_json from './a-propos-text.json';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { BannerSection } from '../../layout/banner-section/banner-section';
import { CTASection } from '../../layout/cta-section/cta-section';
import { Router } from '@angular/router';
import { SafeHtmlPipe } from "../../../pipes/safe-html-pipe";
import { Carousel } from '../../shared/carousel/carousel';


@Component({
  selector: 'app-a-propos',
  imports: [BannerSection, CTASection, AnimateOnVisibleDirective, SafeHtmlPipe, Carousel],
  templateUrl: './a-propos.html',
  styleUrl: './a-propos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class APropos {

  a_propos_text = import_a_propos_text_json;

  bannerTitle: string = this.a_propos_text.banner.title;
  bannerSubtitle: string = this.a_propos_text.banner.subtitle;
  bannerImage: string = this.a_propos_text.banner.image_url;

  cta_title: string = this.a_propos_text.cta_section.title;
  cta_text: string = this.a_propos_text.cta_section.text;
  cta_question: string = this.a_propos_text.cta_section.question;

  nbOfPhotos = 7;
  photosUrl = this.a_propos_text.installations_section.photos_url;

  constructor(private readonly router: Router) {}

  onHtmlClick(event: Event) {
    const target = event.target as HTMLElement;

    if (target.tagName === 'A') {
      event.preventDefault();
      const url = target.getAttribute('href');
      if (url) {
        this.router.navigateByUrl(url);
      }
    }
  }

}
