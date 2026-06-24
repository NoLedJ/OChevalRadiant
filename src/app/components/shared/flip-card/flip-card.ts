import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { SafeHtmlPipe } from "../../../pipes/safe-html-pipe";

@Component({
  selector: 'app-flip-card',
  imports: [SafeHtmlPipe],
  templateUrl: './flip-card.html',
  styleUrl: './flip-card.scss',
})
export class FlipCard {

  @ViewChild('flipCard', { static: false }) flipCard?: ElementRef<HTMLElement>;

  card = input<any>();

  isFlipped = false;

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
    const el = this.flipCard?.nativeElement;
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
