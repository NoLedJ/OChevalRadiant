import { Component } from '@angular/core';
import { CTASection } from '../shared/cta-section/cta-section';
import import_definition_card_json from './bienfaits-definition-card.json';
import { DefinitionCardArrayInterface } from '../shared/definition-card/definition-card.interface';
import { DefinitionCard } from '../shared/definition-card/definition-card';

@Component({
  selector: 'app-bienfaits',
  imports: [CTASection, DefinitionCard],
  templateUrl: './bienfaits.html',
  styleUrl: './bienfaits.scss',
})
export class Bienfaits {

  definitionCards: DefinitionCardArrayInterface = import_definition_card_json;
  cta_title: string = "Profitez des bienfaits du cheval";
  cta_text: string = "L’équithérapie est une approche inclusive, adaptable et centrée sur la personne, quel que soit l’âge, le parcours ou la situation. Le cheval accompagne chacun dans un cheminement unique, respectueux et profondément humain.";
  cta_question: string = "Vous souhaitez tenter l'expérience ?";

}
