import { Component, input } from '@angular/core';

@Component({
  selector: 'app-facebook-button',
  imports: [],
  templateUrl: './facebook-button.html',
  styleUrl: './facebook-button.scss',
})
export class FacebookButton {

  text_button = input<string>("Suivez notre actualité");
  width = input<string>("auto");
  display = input<string>("inherit");
  onFooter = input<boolean>(false);

}
