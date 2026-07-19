import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { BannerSection } from '../../layout/banner-section/banner-section';
import { CTASection } from '../../layout/cta-section/cta-section';
import { Carousel } from '../../shared/carousel/carousel';
import { ProposalCard } from '../../shared/proposal-card/proposal-card';
import import_accompagnements_text_json from './accompagnements-text.json';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-accompagnements',
  imports: [ProposalCard, CTASection, BannerSection, AnimateOnVisibleDirective, Carousel],
  templateUrl: './accompagnements.html',
  styleUrl: './accompagnements.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Accompagnements {

  accompagnements_text  = import_accompagnements_text_json;

  bannerTitle: string = this.accompagnements_text.banner.title;
  bannerSubtitle: string = this.accompagnements_text.banner.subtitle;
  bannerImage: string = this.accompagnements_text.banner.image_url;

  cta_title: string = this.accompagnements_text.cta_section.title;
  cta_text: string = this.accompagnements_text.cta_section.text;

  nbOfPhotos = 4;
  photosUrl = this.accompagnements_text.studio.photos_url;

}
