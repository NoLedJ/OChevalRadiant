import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import import_contact_json from '../contact/contact.json';
import { ContactArrayInterface } from '../contact/contact.interface';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

  contacts: ContactArrayInterface = import_contact_json;

}
