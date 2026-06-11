import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-cta-section',
  imports: [RouterLink, AnimateOnVisibleDirective],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.scss',
})
export class CTASection {

  cta_title = input<string|null>(null);
  cta_text = input<string|null>(null);
  cta_question = input<string|null>(null);
  on_contact_page = input<boolean>(false);

}
