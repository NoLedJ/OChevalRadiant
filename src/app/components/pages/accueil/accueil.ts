import { Component } from '@angular/core';
import { FacebookButton } from "../../shared/facebook-button/facebook-button";
import { DefinitionCard } from '../../shared/definition-card/definition-card';
import { DefinitionCardArrayInterface } from '../../shared/definition-card/definition-card.interface';
import import_definition_card_json from './accueil-definition-card.json';
import { RouterLink } from '@angular/router';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { BannerSection } from "../../shared/banner-section/banner-section";

@Component({
  selector: 'app-accueil',
  imports: [FacebookButton, DefinitionCard, RouterLink, AnimateOnVisibleDirective, BannerSection],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {

  definitionCards: DefinitionCardArrayInterface = import_definition_card_json;

  bannerTitle: string = "Connecter les cœurs grâce à l'équithérapie";
  bannerSubtitle: string = "Découvrez le pouvoir de guérison de la nature et des chevaux à Ô Cheval Radiant, où nous tissons des liens profonds entre l'humain et le vivant.";
  bannerImage: string = "/images/accueil/hero-header";

}
