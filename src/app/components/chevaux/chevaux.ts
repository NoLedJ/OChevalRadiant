import { Component } from '@angular/core';
import { PresentationCardArrayInterface } from '../shared/presentation-card/presentation-card.interface';
import import_presentation_card_json from './chevaux-presentation-card.json';
import { PresentationCard } from '../shared/presentation-card/presentation-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chevaux',
  imports: [PresentationCard, RouterLink],
  templateUrl: './chevaux.html',
  styleUrl: './chevaux.scss',
})
export class Chevaux {

  presentationCards: PresentationCardArrayInterface = import_presentation_card_json;

}
