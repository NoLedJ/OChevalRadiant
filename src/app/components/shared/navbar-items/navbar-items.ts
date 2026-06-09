import { Component, input, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-items',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-items.html',
  styleUrl: './navbar-items.scss',
})
export class NavbarItems {

  popUpMenu = input(false);
  openMenu = model();

}
