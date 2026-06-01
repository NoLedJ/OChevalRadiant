import { Component } from '@angular/core';
import { ProposalCard } from '../shared/proposal-card/proposal-card';
import { ProposalCardArrayInterface } from '../shared/proposal-card/proposal-card.interface';
import import_proposal_card_json from './services-proposal-card.json';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  imports: [ProposalCard, RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {

  proposalCards: ProposalCardArrayInterface = import_proposal_card_json;

}
