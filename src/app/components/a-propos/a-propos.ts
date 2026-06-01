import { Component } from '@angular/core';
import { DefinitionCardArrayInterface } from '../shared/definition-card/definition-card.interface';
import import_definition_card_json from './a-propos-definition-card.json';
import { DefinitionCard } from '../shared/definition-card/definition-card';

@Component({
  selector: 'app-a-propos',
  imports: [DefinitionCard],
  templateUrl: './a-propos.html',
  styleUrl: './a-propos.scss',
})
export class APropos {

  definitionCards: DefinitionCardArrayInterface = import_definition_card_json;

}
