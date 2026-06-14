import import_conditions_utilisation_text_json from './conditions-utilisation-text.json';
import { Component } from '@angular/core';

@Component({
  selector: 'app-conditions-utilisation',
  imports: [],
  templateUrl: './conditions-utilisation.html',
  styleUrl: './conditions-utilisation.scss',
})
export class ConditionsUtilisation {

  conditions_utilisation_text = import_conditions_utilisation_text_json;

}
