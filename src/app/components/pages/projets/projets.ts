import import_projets_text_json from './projets-text.json';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BannerSection } from '../../layout/banner-section/banner-section';
import { CTASection } from '../../layout/cta-section/cta-section';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { FsLightbox } from "fslightbox-angular";
import { Router } from '@angular/router';
import { SafeHtmlPipe } from "../../../pipes/safe-html-pipe";

@Component({
  selector: 'app-projets',
  imports: [CTASection, BannerSection, AnimateOnVisibleDirective, FsLightbox, SafeHtmlPipe],
  templateUrl: './projets.html',
  styleUrl: './projets.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Projets {

  projets_text = import_projets_text_json;

  bannerTitle: string = this.projets_text.banner.title;
  bannerSubtitle: string = this.projets_text.banner.subtitle;
  bannerImage: string = this.projets_text.banner.image_url;

  cta_title: string = this.projets_text.cta_section.title;
  cta_text: string = this.projets_text.cta_section.text;
  cta_question: string = this.projets_text.cta_section.question;

  toggler: boolean = false;
  sources: string[] = [];
  slide: number = 0;

  constructor(private readonly router: Router){
    this.projets_text.main_sections.forEach(section => {
      if (section.photos) {
        section.photos.forEach(photo => {
          this.sources.push(`${photo.photos_url}.webp`);
        });
      }
    });
  }

  onHtmlClick(event: Event) {
    const target = event.target as HTMLElement;

    if (target.tagName === 'A') {
      event.preventDefault();
      const url = target.getAttribute('href');
      if (url) {
        this.router.navigateByUrl(url);
      }
    }
  }

  openLightbox(sectionId: number): void {
    this.slide = sectionId;
    this.toggler = !this.toggler;
  }

}
