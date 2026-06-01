import { Component, Input } from '@angular/core';
import { PresentationCardInterface } from './presentation-card.interface';

@Component({
  selector: 'app-presentation-card',
  imports: [],
  templateUrl: './presentation-card.html',
  styleUrl: './presentation-card.scss',
})
export class PresentationCard {

  @Input() card!: PresentationCardInterface;

}
