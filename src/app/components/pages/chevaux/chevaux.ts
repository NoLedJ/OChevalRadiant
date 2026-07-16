import import_chevaux_text_json from './chevaux-text.json';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PresentationCard } from '../../shared/presentation-card/presentation-card';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { CTASection } from '../../layout/cta-section/cta-section';
import { SafeHtmlPipe } from "../../../pipes/safe-html-pipe";

@Component({
  selector: 'app-chevaux',
  imports: [PresentationCard, CTASection, AnimateOnVisibleDirective, SafeHtmlPipe],
  templateUrl: './chevaux.html',
  styleUrl: './chevaux.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Chevaux {

  chevaux_text = import_chevaux_text_json;

  cta_title: string = this.chevaux_text.cta_section.title;
  cta_text: string = this.chevaux_text.cta_section.text;

}
