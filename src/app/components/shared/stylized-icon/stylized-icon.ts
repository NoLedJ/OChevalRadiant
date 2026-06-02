import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stylized-icon',
  imports: [],
  templateUrl: './stylized-icon.html',
  styleUrl: './stylized-icon.scss',
})
export class StylizedIcon {

  @Input() icon_url!: string;
  @Input() size: string = '3.5rem';

}
