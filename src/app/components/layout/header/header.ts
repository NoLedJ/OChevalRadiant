import { Component, model } from '@angular/core';
import { RouterLink } from "@angular/router";
import { PopUpMenu } from '../pop-up-menu/pop-up-menu';
import { NavbarItems } from "../../shared/navbar-items/navbar-items";

@Component({
  selector: 'app-header',
  imports: [RouterLink, PopUpMenu, NavbarItems],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  openMenu = model(false);

}
