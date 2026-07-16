import import_bienfaits_text_json from './bienfaits-text.json';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DefinitionCard } from '../../shared/definition-card/definition-card';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { CTASection } from '../../layout/cta-section/cta-section';
import { BannerSection } from '../../layout/banner-section/banner-section';

@Component({
  selector: 'app-bienfaits',
  imports: [CTASection, DefinitionCard, BannerSection, AnimateOnVisibleDirective],
  templateUrl: './bienfaits.html',
  styleUrl: './bienfaits.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
