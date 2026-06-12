import import_footer_text_json from './footer-text.json';
import import_contact_text_json from '../../pages/contact/contact-text.json';
import import_navigation_link_json from '../../shared/navbar-items/navigation-link.json';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FacebookButton } from "../../shared/facebook-button/facebook-button";
import { Logo } from '../../shared/logo/logo';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FacebookButton, Logo],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

  footer_text = import_footer_text_json;
  contact_text = import_contact_text_json;
  navigation_links = import_navigation_link_json;
}
