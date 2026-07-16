import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DefinitionCardInterface } from './definition-card.interface';
import { StylizedIcon } from '../stylized-icon/stylized-icon';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';

@Component({
  selector: 'app-definition-card',
  imports: [StylizedIcon, AnimateOnVisibleDirective],
  templateUrl: './definition-card.html',
  styleUrl: './definition-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionCard {

  card = input<DefinitionCardInterface>();

}
