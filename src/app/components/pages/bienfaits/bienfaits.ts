import import_bienfaits_text_json from './bienfaits-text.json';
import { Component } from '@angular/core';
import { CTASection } from '../../shared/cta-section/cta-section';
import { DefinitionCard } from '../../shared/definition-card/definition-card';
import { BannerSection } from "../../shared/banner-section/banner-section";
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-bienfaits',
  imports: [CTASection, DefinitionCard, BannerSection, AnimateOnVisibleDirective],
  templateUrl: './bienfaits.html',
  styleUrl: './bienfaits.scss',
})
export class Bienfaits {

  bienfaits_text = import_bienfaits_text_json;

  bannerTitle: string = this.bienfaits_text.banner.title;
  bannerSubtitle: string = this.bienfaits_text.banner.subtitle;
  bannerImage: string = this.bienfaits_text.banner.image_url;

  cta_title: string = this.bienfaits_text.cta_section.title;
  cta_text: string = this.bienfaits_text.cta_section.text;
  cta_question: string = this.bienfaits_text.cta_section.question;

}
