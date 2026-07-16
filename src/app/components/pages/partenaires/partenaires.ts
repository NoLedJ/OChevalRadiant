import import_partenaires_text_json from './partenaires-text.json';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BannerSection } from '../../layout/banner-section/banner-section';
import { CTASection } from '../../layout/cta-section/cta-section';
import { FsLightbox } from "fslightbox-angular";
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { SafeHtmlPipe } from "../../../pipes/safe-html-pipe";

@Component({
  selector: 'app-partenaires',
  imports: [CTASection, BannerSection, FsLightbox, AnimateOnVisibleDirective, SafeHtmlPipe],
  templateUrl: './partenaires.html',
  styleUrl: './partenaires.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Partenaires {

  partenaires_text = import_partenaires_text_json;

  bannerTitle: string = this.partenaires_text.banner.title;
  bannerSubtitle: string = this.partenaires_text.banner.subtitle;
  bannerImage: string = this.partenaires_text.banner.image_url;

  cta_title: string = this.partenaires_text.cta_section.title;
  cta_text: string = this.partenaires_text.cta_section.text;
  cta_question: string = this.partenaires_text.cta_section.question;

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
      this.sources_chantier.push(`/images/partenaires/chantier0${i}.webp`);
      this.sources_espace.push(`/images/partenaires/espace0${i}.webp`);
      this.sources_chantier_thumbnail.push(`/images/partenaires/chantier0${i}-thumbnail.webp`);
      this.sources_espace_thumbnail.push(`/images/partenaires/espace0${i}-thumbnail.webp`);
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
