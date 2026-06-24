import import_cta_section_text_json from './cta-section-text.json';
import import_navigation_link_json from '../../layout/navbar-items/navigation-link.json';
import import_facebook_text_json from '../../shared/facebook-button/facebook-text.json';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { SafeHtmlPipe } from "../../../pipes/safe-html-pipe";

@Component({
  selector: 'app-cta-section',
  imports: [RouterLink, AnimateOnVisibleDirective, SafeHtmlPipe],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.scss',
})
export class CTASection {

  cta_section_text = import_cta_section_text_json;
  navigation_links = import_navigation_link_json;
  facebook_text = import_facebook_text_json;

  cta_title = input<string>("");
  cta_text = input<string>("");
  cta_question = input<string>("");
  on_contact_page = input<boolean>(false);

}
