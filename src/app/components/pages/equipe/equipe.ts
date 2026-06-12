import import_equipe_text_json from './equipe-text.json';
import { Component } from '@angular/core';
import { PresentationCard } from '../../shared/presentation-card/presentation-card';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { CTASection } from '../../layout/cta-section/cta-section';

@Component({
  selector: 'app-equipe',
  imports: [PresentationCard, CTASection, AnimateOnVisibleDirective],
  templateUrl: './equipe.html',
  styleUrl: './equipe.scss',
})
export class Equipe {

  equipe_text  = import_equipe_text_json;

  cta_title: string = this.equipe_text.cta_section.title;
  cta_text: string = this.equipe_text.cta_section.text;
  cta_question: string = this.equipe_text.cta_section.question;

}
