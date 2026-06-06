import { Component } from '@angular/core';
import { PresentationCardArrayInterface } from '../../shared/presentation-card/presentation-card.interface';
import import_presentation_card_json from './chevaux-presentation-card.json';
import { PresentationCard } from '../../shared/presentation-card/presentation-card';
import { CTASection } from '../../shared/cta-section/cta-section';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-chevaux',
  imports: [PresentationCard, CTASection, AnimateOnVisibleDirective],
  templateUrl: './chevaux.html',
  styleUrl: './chevaux.scss',
})
export class Chevaux {

  presentationCards: PresentationCardArrayInterface = import_presentation_card_json;
  cta_title: string = "Rencontrer nos chevaux";
  cta_text: string = "Passer du temps auprès de nos chevaux, c’est découvrir leur sensibilité, leur douceur et leur manière unique d’entrer en relation avec chacun.";

}
