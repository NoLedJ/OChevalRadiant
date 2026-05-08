import { Component } from '@angular/core';
import { FacebookButton } from "../shared/facebook-button/facebook-button";
import { DefinitionCard } from './definition-card/definition-card';
import { DefinitionCardInterface } from './definition-card/definition-card.interface';
import import_definition_card_json from './definition-card/definition-card.json';

@Component({
  selector: 'app-accueil',
  imports: [FacebookButton, DefinitionCard],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {

  definitionCards: DefinitionCardInterface = import_definition_card_json;

}
