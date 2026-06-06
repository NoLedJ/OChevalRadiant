import { Component } from '@angular/core';
import { FsLightbox } from "fslightbox-angular";
import { CTASection } from '../../shared/cta-section/cta-section';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-experiences',
  imports: [FsLightbox, CTASection, AnimateOnVisibleDirective],
  templateUrl: './experiences.html',
  styleUrl: './experiences.scss',
})
export class Experiences {

  cta_title: string = "Forgez votre propre expérience";
  cta_text: string = "Les moments partagés ici ne sont qu’un aperçu de ce que chacun peut vivre auprès des chevaux. Rien ne remplace la richesse d’une rencontre personnelle, au rythme de vos émotions et de leur présence apaisante.";
  cta_question: string = "Vous souhaitez devenir vous aussi l'un de nos participants ?";

  nbOfPhotos = 17;
  toggler: boolean = false;
  sources: string[] = [];
  slide: number = 0;

  constructor() {
    for (let i = 1; i <= this.nbOfPhotos; i++) {
      this.sources.push(`/images/experiences/experience${i}.jpg`);
    }
  }

  openLightbox(index: number): void {
    this.slide = index + 1;
    this.toggler = !this.toggler;
  }

}
