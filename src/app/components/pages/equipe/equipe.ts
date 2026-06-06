import { Component } from '@angular/core';
import { PresentationCard } from '../../shared/presentation-card/presentation-card';
import { PresentationCardArrayInterface } from '../../shared/presentation-card/presentation-card.interface';
import import_presentation_card_json from './equipe-presentation-card.json';
import { CTASection } from '../../shared/cta-section/cta-section';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-equipe',
  imports: [PresentationCard, CTASection, AnimateOnVisibleDirective],
  templateUrl: './equipe.html',
  styleUrl: './equipe.scss',
})
export class Equipe {

  presentationCards: PresentationCardArrayInterface = import_presentation_card_json;
  cta_title: string = "Rejoignez notre équipe de bénévoles";
  cta_text: string = "Nous sommes toujours à la recherche de personnes passionnées qui souhaitent contribuer à notre mission. Que vous ayez de l'expérience avec les chevaux ou simplement l'envie d'aider, vous avez votre place à Ô Cheval Radiant.";
  cta_question: string = "Vous souhaitez devenir bénévole ?";
}
