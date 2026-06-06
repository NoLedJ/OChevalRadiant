import { Component } from '@angular/core';
import { ProposalCard } from '../../shared/proposal-card/proposal-card';
import { ProposalCardArrayInterface } from '../../shared/proposal-card/proposal-card.interface';
import import_proposal_card_json from './services-proposal-card.json';
import { CTASection } from '../../shared/cta-section/cta-section';
import { BannerSection } from '../../shared/banner-section/banner-section';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-services',
  imports: [
    ProposalCard,
    CTASection,
    BannerSection,
    AnimateOnVisibleDirective
  ],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {

  proposalCards: ProposalCardArrayInterface = import_proposal_card_json;

  bannerTitle: string = "Nos services";
  bannerSubtitle: string = "Des programmes professionnels d'équithérapie conçus pour accompagner votre cheminement";
  bannerImage: string = "/images/services/banner.jpg";

  cta_title: string = "Prêt à commencer ?";
  cta_text: string = "Contactez-nous pour en savoir plus sur nos services, planifier une visite ou réserver votre première séance. Nous avons hâte de vous accueillir à Ô Cheval Radiant.";

}
