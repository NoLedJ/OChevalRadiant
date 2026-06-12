import import_partenaires_text_json from './partenaires-text.json';
import { Component } from '@angular/core';
import { CTASection } from '../../shared/cta-section/cta-section';
import { BannerSection } from '../../shared/banner-section/banner-section';

@Component({
  selector: 'app-partenaires',
  imports: [CTASection, BannerSection],
  templateUrl: './partenaires.html',
  styleUrl: './partenaires.scss',
})
export class Partenaires {

  partenaires_text = import_partenaires_text_json;

  bannerTitle: string = this.partenaires_text.banner.title;
  bannerSubtitle: string = this.partenaires_text.banner.subtitle;
  bannerImage: string = this.partenaires_text.banner.image_url;

  cta_title: string = this.partenaires_text.cta_section.title;
  cta_text: string = this.partenaires_text.cta_section.text;
  cta_question: string = this.partenaires_text.cta_section.question;

}
