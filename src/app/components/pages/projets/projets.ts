import import_projets_text_json from './projets-text.json';
import { Component } from '@angular/core';
import { BannerSection } from '../../layout/banner-section/banner-section';
import { CTASection } from '../../layout/cta-section/cta-section';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-projets',
  imports: [CTASection, BannerSection, AnimateOnVisibleDirective],
  templateUrl: './projets.html',
  styleUrl: './projets.scss',
})
export class Projets {

  projets_text = import_projets_text_json;

  bannerTitle: string = this.projets_text.banner.title;
  bannerSubtitle: string = this.projets_text.banner.subtitle;
  bannerImage: string = this.projets_text.banner.image_url;

  cta_title: string = this.projets_text.cta_section.title;
  cta_text: string = this.projets_text.cta_section.text;
  cta_question: string = this.projets_text.cta_section.question;

}
