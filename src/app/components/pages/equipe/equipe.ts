import import_equipe_text_json from './equipe-text.json';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PresentationCard } from '../../shared/presentation-card/presentation-card';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { CTASection } from '../../layout/cta-section/cta-section';
import { ProposalCard } from '../../shared/proposal-card/proposal-card';

@Component({
  selector: 'app-equipe',
  imports: [PresentationCard, CTASection, AnimateOnVisibleDirective, ProposalCard],
  templateUrl: './equipe.html',
  styleUrl: './equipe.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Equipe {

  equipe_text  = import_equipe_text_json;

  cta_title: string = this.equipe_text.cta_section.title;
  cta_text: string = this.equipe_text.cta_section.text;
  cta_question: string = this.equipe_text.cta_section.question;

}
