import import_politique_confidentialite_text_json from './politique-confidentialite-text.json';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-politique-confidentialite',
  imports: [],
  templateUrl: './politique-confidentialite.html',
  styleUrl: './politique-confidentialite.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolitiqueConfidentialite {

  politique_confidentialite_text = import_politique_confidentialite_text_json;

}
