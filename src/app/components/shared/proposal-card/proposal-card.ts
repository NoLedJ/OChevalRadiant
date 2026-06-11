import { Component, input } from '@angular/core';
import { ProposalCardInterface } from './proposal-card.interface';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-proposal-card',
  imports: [AnimateOnVisibleDirective],
  templateUrl: './proposal-card.html',
  styleUrl: './proposal-card.scss',
})
export class ProposalCard {

  card = input<ProposalCardInterface>();

}
