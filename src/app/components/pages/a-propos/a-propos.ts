import { Component } from '@angular/core';
import { FsLightbox } from "fslightbox-angular";
import { CTASection } from '../../shared/cta-section/cta-section';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { BannerSection } from '../../shared/banner-section/banner-section';
import import_a_propos_text_json from './a-propos-text.json';

@Component({
  selector: 'app-a-propos',
  imports: [
    FsLightbox,
    BannerSection,
    CTASection,
    AnimateOnVisibleDirective
  ],
  templateUrl: './a-propos.html',
  styleUrl: './a-propos.scss',
})
export class APropos {

  a_propos_text = import_a_propos_text_json;

  bannerTitle: string = this.a_propos_text.banner.title;
  bannerSubtitle: string = this.a_propos_text.banner.subtitle;
  bannerImage: string = this.a_propos_text.banner.image_url;

  cta_title: string = this.a_propos_text.cta_section.title;
  cta_text: string = this.a_propos_text.cta_section.text;
  cta_question: string = this.a_propos_text.cta_section.question;

  nbOfPhotos = 3;
  toggler: boolean = false;
  sources: string[] = [];
  sources_thumbnail: string[] = [];
  slide: number = 0;

  constructor() {
    for (let i = 1; i <= this.nbOfPhotos; i++) {
      this.sources.push(`${this.a_propos_text.installations_section.photos_url}${i}.jpg`);
      this.sources_thumbnail.push(`${this.a_propos_text.installations_section.photos_url}${i}-thumbnail.jpg`);
    }
  }

  openLightbox(index: number): void {
    this.slide = index + 1;
    this.toggler = !this.toggler;
  }

}
