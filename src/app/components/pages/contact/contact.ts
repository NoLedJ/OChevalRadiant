import import_contact_text_json from './contact-text.json';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StylizedIcon } from '../../shared/stylized-icon/stylized-icon';
import { FacebookButton } from "../../shared/facebook-button/facebook-button";
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { CTASection } from '../../layout/cta-section/cta-section';

@Component({
  selector: 'app-contact',
  imports: [StylizedIcon, CTASection, FacebookButton, AnimateOnVisibleDirective, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Contact {

  // Deliberately scoped to this visit: no storage or shared consent service.
  readonly mapVisible = signal(false);

  contact_text = import_contact_text_json;

  cta_title: string = this.contact_text.cta_section.title;
  cta_text: string = this.contact_text.cta_section.text;

  coordonnees_array = Object.values(this.contact_text.coordonnees_section.coordonnees_infos);

}
