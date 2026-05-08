import { Component, Input } from '@angular/core';
import { Card } from './definition-card.interface';

@Component({
  selector: 'app-definition-card',
  imports: [],
  templateUrl: './definition-card.html',
  styleUrl: './definition-card.scss',
})
export class DefinitionCard {
  @Input() card!: Card;
}
