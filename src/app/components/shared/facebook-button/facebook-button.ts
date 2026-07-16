import import_facebook_text_json from './facebook-text.json';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-facebook-button',
  imports: [],
  templateUrl: './facebook-button.html',
  styleUrl: './facebook-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacebookButton {

  facebook_text = import_facebook_text_json;

  onContact = input<boolean>(false);
  width = input<string>("auto");
  display = input<string>("inherit");
  onFooter = input<boolean>(false);

}
