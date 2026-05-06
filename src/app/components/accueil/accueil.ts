import { Component } from '@angular/core';
import { FacebookButton } from "../shared/facebook-button/facebook-button";
import { DefinitionCard } from './definition-card/definition-card';

@Component({
  selector: 'app-accueil',
  imports: [FacebookButton, DefinitionCard],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {

}
