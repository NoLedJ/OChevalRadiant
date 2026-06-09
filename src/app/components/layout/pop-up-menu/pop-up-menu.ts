import { Component, model } from '@angular/core';
import { NavbarItems } from "../../shared/navbar-items/navbar-items";

@Component({
  selector: 'app-pop-up-menu',
  imports: [NavbarItems],
  templateUrl: './pop-up-menu.html',
  styleUrl: './pop-up-menu.scss',
})
export class PopUpMenu {

  openMenu = model<boolean>();

}
