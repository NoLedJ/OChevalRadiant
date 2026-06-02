import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta-section',
  imports: [RouterLink],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.scss',
})
export class CTASection {

  @Input() cta_title: string|null = null;
  @Input() cta_text: string|null = null;
  @Input() cta_question: string|null = null;
  @Input() on_contact_page: boolean = false;

}
