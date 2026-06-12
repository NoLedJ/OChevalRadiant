import { Component, model } from '@angular/core';
import { PopUpMenu } from '../pop-up-menu/pop-up-menu';
import { NavbarItems } from "../../layout/navbar-items/navbar-items";
import { Logo } from "../../layout/logo/logo";

@Component({
  selector: 'app-header',
  imports: [PopUpMenu, NavbarItems, Logo],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  openMenu = model(false);

}
