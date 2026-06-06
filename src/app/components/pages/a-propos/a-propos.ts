import { Component } from '@angular/core';
import { FsLightbox } from "fslightbox-angular";
import { CTASection } from '../../shared/cta-section/cta-section';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { BannerSection } from '../../shared/banner-section/banner-section';


@Component({
  selector: 'app-a-propos',
  imports: [
    FsLightbox,
    BannerSection,
    CTASection,
    AnimateOnVisibleDirective
  ],
  templateUrl: './a-propos.html',
  styleUrl: './a-propos.scss',
})
export class APropos {

  bannerTitle: string = "À propos d'Ô Cheval Radiant";
  bannerSubtitle: string = "Créer des ponts entre les humains, la nature et le vivant.";
  bannerImage: string = "/images/a-propos/banner.jpg";

  cta_title: string = "Découvrez-nous davantage";
  cta_text: string = "Notre approche place la relation au cheval au cœur de chaque accompagnement. Au‑delà des mots, c’est une expérience qui se vit : une rencontre authentique, un moment suspendu où chacun peut se découvrir autrement. Le mieux pour comprendre ce que nous faisons est encore de venir le ressentir par vous‑même, au rythme des chevaux.";
  cta_question: string = "Vous aimeriez en savoir plus sur nos accompagnements ?";

  nbOfPhotos = 3;
  toggler: boolean = false;
  sources: string[] = [];
  slide: number = 0;

  constructor() {
    for (let i = 1; i <= this.nbOfPhotos; i++) {
      this.sources.push(`/images/a-propos/location0${i}.jpg`);
    }
  }

  openLightbox(index: number): void {
    this.slide = index + 1;
    this.toggler = !this.toggler;
  }

}
