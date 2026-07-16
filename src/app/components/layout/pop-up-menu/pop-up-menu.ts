import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { NavbarItems } from "../../layout/navbar-items/navbar-items";

@Component({
  selector: 'app-pop-up-menu',
  imports: [NavbarItems],
  templateUrl: './pop-up-menu.html',
  styleUrl: './pop-up-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopUpMenu {

  openMenu = model<boolean>();

}
