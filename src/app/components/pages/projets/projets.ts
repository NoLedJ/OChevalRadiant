import import_projets_text_json from './projets-text.json';
import { Component } from '@angular/core';
import { BannerSection } from '../../layout/banner-section/banner-section';
import { CTASection } from '../../layout/cta-section/cta-section';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { FsLightbox } from "fslightbox-angular";

@Component({
  selector: 'app-projets',
  imports: [CTASection, BannerSection, AnimateOnVisibleDirective, FsLightbox],
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

  nbOfPhotos = 3;
  toggler_chantier: boolean = false;
  toggler_espace: boolean = false;
  sources_chantier: string[] = [];
  sources_espace: string[] = [];
  sources_chantier_thumbnail: string[] = [];
  sources_espace_thumbnail: string[] = [];
  slide_chantier: number = 0;
  slide_espace: number = 0;

  constructor() {
    for (let i = 1; i <= this.nbOfPhotos; i++) {
      this.sources_chantier.push(`/images/projets/chantier0${i}.jpg`);
      this.sources_espace.push(`/images/projets/espace0${i}.jpg`);
      this.sources_chantier_thumbnail.push(`/images/projets/chantier0${i}-thumbnail.jpg`);
      this.sources_espace_thumbnail.push(`/images/projets/espace0${i}-thumbnail.jpg`);
    }
  }

  openLightbox(index: number, typePhotos: string): void {
    if (typePhotos == "chantier") {
      this.slide_chantier = index + 1;
      this.toggler_chantier = !this.toggler_chantier;
    }
    if (typePhotos == "espace") {
      this.slide_espace = index + 1;
      this.toggler_espace = !this.toggler_espace;
    }
  }

}
