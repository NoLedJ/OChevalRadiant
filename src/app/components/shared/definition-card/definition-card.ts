import { Component, Input } from '@angular/core';
import { DefinitionCardInterface } from './definition-card.interface';
import { StylizedIcon } from '../stylized-icon/stylized-icon';

@Component({
  selector: 'app-definition-card',
  imports: [StylizedIcon],
  templateUrl: './definition-card.html',
  styleUrl: './definition-card.scss',
})
export class DefinitionCard {

  @Input() card!: DefinitionCardInterface;

}
