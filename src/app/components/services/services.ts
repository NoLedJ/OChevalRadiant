import { Component } from '@angular/core';
import { ProposalCard } from '../shared/proposal-card/proposal-card';
import { ProposalCardArrayInterface } from '../shared/proposal-card/proposal-card.interface';
import import_proposal_card_json from './services-proposal-card.json';
import { CTASection } from '../shared/cta-section/cta-section';

@Component({
  selector: 'app-services',
  imports: [ProposalCard, CTASection],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {

  proposalCards: ProposalCardArrayInterface = import_proposal_card_json;
  cta_title: string = "Prêt à commencer ?";
  cta_text: string = "Contactez-nous pour en savoir plus sur nos services, planifier une visite ou réserver votre première séance. Nous avons hâte de vous accueillir à Ô Cheval Radiant.";

}
