import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-facebook-button',
  imports: [],
  templateUrl: './facebook-button.html',
  styleUrl: './facebook-button.scss',
})
export class FacebookButton {

  @Input() text_button: string = "Suivez notre actualité";
  @Input() width: string = "auto";
  @Input() display: string = "inherit";

}
