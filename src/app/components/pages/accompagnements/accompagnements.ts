import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { BannerSection } from '../../layout/banner-section/banner-section';
import { CTASection } from '../../layout/cta-section/cta-section';
import { ProposalCard } from '../../shared/proposal-card/proposal-card';
import import_accompagnements_text_json from './accompagnements-text.json';
import { Component } from '@angular/core';
import { FsLightbox } from "fslightbox-angular";

@Component({
  selector: 'app-accompagnements',
  imports: [ProposalCard, CTASection, BannerSection, AnimateOnVisibleDirective, FsLightbox],
  templateUrl: './accompagnements.html',
  styleUrl: './accompagnements.scss',
})
export class Accompagnements {

  toggler: boolean = false;

  accompagnements_text  = import_accompagnements_text_json;

  bannerTitle: string = this.accompagnements_text.banner.title;
  bannerSubtitle: string = this.accompagnements_text.banner.subtitle;
  bannerImage: string = this.accompagnements_text.banner.image_url;

  cta_title: string = this.accompagnements_text.cta_section.title;
  cta_text: string = this.accompagnements_text.cta_section.text;

  openLightbox(): void {
    this.toggler = !this.toggler;
  }

}
