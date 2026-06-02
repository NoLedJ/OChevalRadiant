import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'accueil',
    loadComponent: () =>
      import('./components/accueil/accueil').then(m => m.Accueil)
  },
  {
    path: 'a-propos',
    loadComponent: () =>
      import('./components/a-propos/a-propos').then(m => m.APropos)
  },
  {
    path: 'equipe',
    loadComponent: () =>
      import('./components/equipe/equipe').then(m => m.Equipe)
  },
  {
    path: 'chevaux',
    loadComponent: () =>
      import('./components/chevaux/chevaux').then(m => m.Chevaux)
  },
  {
    path: 'bienfaits',
    loadComponent: () =>
      import('./components/bienfaits/bienfaits').then(m => m.Bienfaits)
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./components/services/services').then(m => m.Services)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/contact/contact').then(m => m.Contact)
  },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' }
];
