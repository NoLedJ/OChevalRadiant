import import_navigation_links_json from '../navbar-items/navigation-link.json';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Logo {

  navigation_links = import_navigation_links_json;

  onFooter = input<boolean>(false);

}
