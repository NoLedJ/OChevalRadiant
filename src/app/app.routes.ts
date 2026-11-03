import { Routes } from '@angular/router';
import { NotFound } from './components/pages/not-found/not-found';
import seoPages from './seo-pages.json';

export const routes: Routes = [
  {
    path: '',
    title: seoPages[""].title,
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/pages/accueil/accueil').then(m => m.Accueil)
  },
  {
    path: 'a-propos',
    title: seoPages["a-propos"].title,
    loadComponent: () =>
      import('./components/pages/a-propos/a-propos').then(m => m.APropos)
  },
  {
    path: 'equipe',
    title: seoPages["equipe"].title,
    loadComponent: () =>
      import('./components/pages/equipe/equipe').then(m => m.Equipe)
  },
  {
    path: 'chevaux',
    title: seoPages["chevaux"].title,
    loadComponent: () =>
      import('./components/pages/chevaux/chevaux').then(m => m.Chevaux)
  },
  {
    path: 'bienfaits',
    title: seoPages["bienfaits"].title,
    loadComponent: () =>
      import('./components/pages/bienfaits/bienfaits').then(m => m.Bienfaits)
  },
  {
    path: 'accompagnements',
    title: seoPages["accompagnements"].title,
    loadComponent: () =>
      import('./components/pages/accompagnements/accompagnements').then(m => m.Accompagnements)
  },
  {
    path: 'experiences',
    title: seoPages["experiences"].title,
    loadComponent: () =>
      import('./components/pages/experiences/experiences').then(m => m.Experiences)
  },
  {
    path: 'projets',
    title: seoPages["projets"].title,
    loadComponent: () =>
      import('./components/pages/projets/projets').then(m => m.Projets)
  },
   {
    path: 'partenaires',
    title: seoPages["partenaires"].title,
    loadComponent: () =>
      import('./components/pages/partenaires/partenaires').then(m => m.Partenaires)
  },
  {
    path: 'contact',
    title: seoPages["contact"].title,
    loadComponent: () =>
      import('./components/pages/contact/contact').then(m => m.Contact)
  },
  {
    path: 'mentions-legales',
    title: seoPages["mentions-legales"].title,
    loadComponent: () =>
      import('./components/pages/mentions-legales/mentions-legales').then(m => m.MentionsLegales)
  },
  {
    path: 'politique-confidentialite',
    title: seoPages["politique-confidentialite"].title,
    loadComponent: () =>
      import('./components/pages/politique-confidentialite/politique-confidentialite').then(m => m.PolitiqueConfidentialite)
  },
  {
    path: 'conditions_utilisation',
    title: seoPages["conditions_utilisation"].title,
    loadComponent: () =>
      import('./components/pages/conditions-utilisation/conditions-utilisation').then(m => m.ConditionsUtilisation)
  },
  { path: '**', component: NotFound }
];
