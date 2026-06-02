import { Component } from '@angular/core';
import import_contact_json from './contact.json';
import { ContactArrayInterface } from './contact.interface';
import { StylizedIcon } from '../shared/stylized-icon/stylized-icon';
import { CTASection } from "../shared/cta-section/cta-section";
import { FacebookButton } from "../shared/facebook-button/facebook-button";

@Component({
  selector: 'app-contact',
  imports: [StylizedIcon, CTASection, FacebookButton],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {

  contacts: ContactArrayInterface = import_contact_json;
  cta_title: string = "Venez nous rendre visite";
  cta_text: string = "Nous sommes ravis d'accueillir des visiteurs dans nos installations. Si vous souhaitez visiter notre domaine, rencontrer nos chevaux ou découvrir nos programmes en personne, merci de nous contacter à l'avance pour planifier votre venue.";

}
