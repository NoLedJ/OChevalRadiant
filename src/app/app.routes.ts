import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'accueil',
    loadComponent: () =>
      import('./components/pages/accueil/accueil').then(m => m.Accueil)
  },
  {
    path: 'a-propos',
    loadComponent: () =>
      import('./components/pages/a-propos/a-propos').then(m => m.APropos)
  },
  {
    path: 'equipe',
    loadComponent: () =>
      import('./components/pages/equipe/equipe').then(m => m.Equipe)
  },
  {
    path: 'chevaux',
    loadComponent: () =>
      import('./components/pages/chevaux/chevaux').then(m => m.Chevaux)
  },
  {
    path: 'bienfaits',
    loadComponent: () =>
      import('./components/pages/bienfaits/bienfaits').then(m => m.Bienfaits)
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./components/pages/services/services').then(m => m.Services)
  },
  {
    path: 'experiences',
    loadComponent: () =>
      import('./components/pages/experiences/experiences').then(m => m.Experiences)
  },
  {
    path: 'projets',
    loadComponent: () =>
      import('./components/pages/projets/projets').then(m => m.Projets)
  },
   {
    path: 'partenaires',
    loadComponent: () =>
      import('./components/pages/partenaires/partenaires').then(m => m.Partenaires)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/pages/contact/contact').then(m => m.Contact)
  },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' }
];
