import import_facebook_text_json from './facebook-text.json';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-facebook-button',
  imports: [],
  templateUrl: './facebook-button.html',
  styleUrl: './facebook-button.scss',
})
export class FacebookButton {

  facebook_text = import_facebook_text_json;

  onContact = input<boolean>(false);
  width = input<string>("auto");
  display = input<string>("inherit");
  onFooter = input<boolean>(false);

}
