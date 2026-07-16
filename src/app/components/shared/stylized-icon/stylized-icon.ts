import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-stylized-icon',
  imports: [],
  templateUrl: './stylized-icon.html',
  styleUrl: './stylized-icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StylizedIcon {

  icon_url = input<string | null>();
  size = input<string>('3.5rem');

}
