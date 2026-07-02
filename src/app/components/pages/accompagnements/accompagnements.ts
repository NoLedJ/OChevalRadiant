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

  accompagnements_text  = import_accompagnements_text_json;

  bannerTitle: string = this.accompagnements_text.banner.title;
  bannerSubtitle: string = this.accompagnements_text.banner.subtitle;
  bannerImage: string = this.accompagnements_text.banner.image_url;

  cta_title: string = this.accompagnements_text.cta_section.title;
  cta_text: string = this.accompagnements_text.cta_section.text;

  nbOfPhotos = 4;
  toggler: boolean = false;
  sources: string[] = [];
  sources_thumbnail: string[] = [];
  slide: number = 0;

  constructor() {
    for (let i = 1; i <= this.nbOfPhotos; i++) {
      this.sources.push(`${this.accompagnements_text.studio.photos_url}${i}.jpg`);
      this.sources_thumbnail.push(`${this.accompagnements_text.studio.photos_url}${i}-thumbnail.jpg`);
    }
  }

  openLightbox(index: number): void {
    this.slide = index + 1;
    this.toggler = !this.toggler;
  }

}
