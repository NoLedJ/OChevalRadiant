import { Component } from '@angular/core';
import { FacebookButton } from "../shared/facebook-button/facebook-button";
import { DefinitionCard } from '../shared/definition-card/definition-card';
import { DefinitionCardArrayInterface } from '../shared/definition-card/definition-card.interface';
import import_definition_card_json from './accueil-definition-card.json';

@Component({
  selector: 'app-accueil',
  imports: [FacebookButton, DefinitionCard],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {

  definitionCards: DefinitionCardArrayInterface = import_definition_card_json;

}
