import { Component } from '@angular/core';
import { CTASection } from '../../shared/cta-section/cta-section';
import { BannerSection } from '../../shared/banner-section/banner-section';

@Component({
  selector: 'app-partenaires',
  imports: [CTASection, BannerSection],
  templateUrl: './partenaires.html',
  styleUrl: './partenaires.scss',
})
export class Partenaires {

  bannerTitle: string = "Nos partenaires engagés";
  bannerSubtitle: string = "Nous collaborons avec des organisations et des individus engagés pour promouvoir notre mission et notre vision.";
  bannerImage: string = "/images/partenaires/banner";

  cta_title: string = "Travailler ensemble";
  cta_text: string = "Nous sommes toujours ouverts à de nouvelles collaborations, qu’elles soient ponctuelles ou régulières. Ensemble, nous pouvons imaginer des projets qui mettent en valeur le cheval, le lien humain et l’inclusion.";
  cta_question: string = "Vous souhaitez devenir partenaire ?";

}
