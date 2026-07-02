import import_experiences_text_json from './experiences-text.json';
import { Component } from '@angular/core';
import { FsLightbox } from "fslightbox-angular";
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { CTASection } from '../../layout/cta-section/cta-section';
import { FlipCard } from '../../shared/flip-card/flip-card';
import { SafeHtmlPipe } from "../../../pipes/safe-html-pipe";

@Component({
  selector: 'app-experiences',
  imports: [FsLightbox, CTASection, AnimateOnVisibleDirective, FlipCard, SafeHtmlPipe],
  templateUrl: './experiences.html',
  styleUrl: './experiences.scss',
})
export class Experiences {

  experiences_text = import_experiences_text_json;

  cta_title: string = this.experiences_text.cta_section.title;
  cta_text: string = this.experiences_text.cta_section.text;
  cta_question: string = this.experiences_text.cta_section.question;

  nbOfPhotos = 14;
  toggler: boolean = false;
  sources: string[] = [];
  sources_thumbnail: string[] = [];
  slide: number = 0;

  constructor() {
    for (let i = 1; i <= this.nbOfPhotos; i++) {
      this.sources.push(`/images/experiences/experience${i}.jpg`);
      this.sources_thumbnail.push(`/images/experiences/experience${i}-thumbnail.jpg`);
    }
  }

  openLightbox(index: number): void {
    this.slide = index + 1;
    this.toggler = !this.toggler;
  }

}
