import { Component, Input } from '@angular/core';
import { ProposalCardInterface } from './proposal-card.interface';

@Component({
  selector: 'app-proposal-card',
  imports: [],
  templateUrl: './proposal-card.html',
  styleUrl: './proposal-card.scss',
})
export class ProposalCard {

  @Input() card!: ProposalCardInterface;

}
