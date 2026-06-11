import { Component, input } from '@angular/core';
import { PresentationCardInterface } from './presentation-card.interface';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-presentation-card',
  imports: [AnimateOnVisibleDirective],
  templateUrl: './presentation-card.html',
  styleUrl: './presentation-card.scss',
})
export class PresentationCard {

  card = input<PresentationCardInterface>();

}
