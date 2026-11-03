import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Shared internal CTA, extracted unchanged from the home page's Contact button.
@Component({
  selector: 'app-action-link',
  imports: [RouterLink],
  templateUrl: './action-link.html',
  styleUrl: './action-link.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionLink {
  link = input.required<string>();
  label = input.required<string>();
}
