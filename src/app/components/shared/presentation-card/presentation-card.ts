import { Component, input } from '@angular/core';
import { PresentationCardInterface } from './presentation-card.interface';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { SafeHtmlPipe } from "../../../pipes/safe-html-pipe";

@Component({
  selector: 'app-presentation-card',
  imports: [AnimateOnVisibleDirective, SafeHtmlPipe],
  templateUrl: './presentation-card.html',
  styleUrl: './presentation-card.scss',
})
export class PresentationCard {

  card = input<PresentationCardInterface>();

}
