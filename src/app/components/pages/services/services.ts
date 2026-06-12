import import_services_text_json from './services-text.json';
import { Component } from '@angular/core';
import { ProposalCard } from '../../shared/proposal-card/proposal-card';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { CTASection } from '../../layout/cta-section/cta-section';
import { BannerSection } from '../../layout/banner-section/banner-section';

@Component({
  selector: 'app-services',
  imports: [
    ProposalCard,
    CTASection,
    BannerSection,
    AnimateOnVisibleDirective
  ],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {

  services_text  = import_services_text_json;

  bannerTitle: string = this.services_text.banner.title;
  bannerSubtitle: string = this.services_text.banner.subtitle;
  bannerImage: string = this.services_text.banner.image_url;

  cta_title: string = this.services_text.cta_section.title;
  cta_text: string = this.services_text.cta_section.text;

}
