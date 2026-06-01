import { Component } from '@angular/core';
import { PresentationCard } from '../shared/presentation-card/presentation-card';
import { PresentationCardArrayInterface } from '../shared/presentation-card/presentation-card.interface';
import import_presentation_card_json from './equipe-presentation-card.json';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-equipe',
  imports: [PresentationCard, RouterLink],
  templateUrl: './equipe.html',
  styleUrl: './equipe.scss',
})
export class Equipe {

  presentationCards: PresentationCardArrayInterface = import_presentation_card_json;

}
