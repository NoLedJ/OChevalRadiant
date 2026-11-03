import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActionLink } from '../../shared/action-link/action-link';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ActionLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {
  private readonly heading = viewChild<ElementRef<HTMLHeadingElement>>('errorHeading');

  constructor() {
    afterNextRender(() => this.heading()?.nativeElement.focus({ preventScroll: true }));
  }
}
