import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import import_navigation_links_json from './navigation-link.json';

@Component({
  selector: 'app-navbar-items',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-items.html',
  styleUrl: './navbar-items.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarItems {

  navigation_links_json = import_navigation_links_json;

  popUpMenu = input(false);
  openMenu = model();

  nav_items = Object.values(this.navigation_links_json);

}
