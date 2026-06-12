import import_mentions_legales_text_json from './mentions-legales-text.json';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mentions-legales',
  imports: [],
  templateUrl: './mentions-legales.html',
  styleUrl: './mentions-legales.scss',
})
export class MentionsLegales {

  mentions_legales_text = import_mentions_legales_text_json;

}
