import import_accueil_text_json from './accueil-text.json';
import import_navigation_link_json from '../../layout/navbar-items/navigation-link.json';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FacebookButton } from "../../shared/facebook-button/facebook-button";
import { DefinitionCard } from '../../shared/definition-card/definition-card';
import { RouterLink } from '@angular/router';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { BannerSection } from '../../layout/banner-section/banner-section';

@Component({
  selector: 'app-accueil',
  imports: [FacebookButton, DefinitionCard, RouterLink, AnimateOnVisibleDirective, BannerSection],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Accueil {

  accueil_text = import_accueil_text_json;
  navigation_links = import_navigation_link_json;

  bannerTitle: string = this.accueil_text.banner.title;
  bannerSubtitle: string = this.accueil_text.banner.subtitle;
  bannerImage: string = this.accueil_text.banner.image_url;

}
