import import_contact_text_json from './contact-text.json';
import { Component } from '@angular/core';
import { StylizedIcon } from '../../shared/stylized-icon/stylized-icon';
import { CTASection } from "../../shared/cta-section/cta-section";
import { FacebookButton } from "../../shared/facebook-button/facebook-button";
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-contact',
  imports: [StylizedIcon, CTASection, FacebookButton, AnimateOnVisibleDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {

  contact_text = import_contact_text_json;

  cta_title: string = this.contact_text.cta_section.title;
  cta_text: string = this.contact_text.cta_section.text;

  coordonnees_array = Object.values(this.contact_text.coordonnees_section.coordonnees_infos);

}
