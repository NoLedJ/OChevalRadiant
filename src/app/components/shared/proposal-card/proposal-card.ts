import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { ProposalCardInterface } from './proposal-card.interface';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-proposal-card',
  imports: [AnimateOnVisibleDirective],
  templateUrl: './proposal-card.html',
  styleUrl: './proposal-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProposalCard {

  card = input<ProposalCardInterface>();
  infos_list = computed(() => this.card()?.info_list?.split("/"));

}
