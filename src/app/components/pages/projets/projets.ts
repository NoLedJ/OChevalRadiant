import { Component } from '@angular/core';
import { CTASection } from '../../shared/cta-section/cta-section';
import { BannerSection } from '../../shared/banner-section/banner-section';

@Component({
  selector: 'app-projets',
  imports: [CTASection, BannerSection],
  templateUrl: './projets.html',
  styleUrl: './projets.scss',
})
export class Projets {

  bannerTitle: string = "Nos projets coopératifs";
  bannerSubtitle: string = "Des initiatives construites ensemble, autour du cheval et du lien humain";
  bannerImage: string = "/images/projets/banner";

  cta_title: string = "Se retrouver ensemble";
  cta_text: string = "Nous sommes toujours ouverts aux collaborations qui mettent en valeur le cheval, le lien humain et l’inclusion. Que vous soyez une structure, une association, une école ou un groupe, nous pouvons imaginer ensemble un projet adapté à vos besoins.";
  cta_question: string = "Envie de partager un projet avec nous ?";

}
