import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'accueil',
    loadComponent: () =>
      import('./components/accueil/accueil').then(m => m.Accueil)
  },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' }
];
