import { Routes } from '@angular/router';
import { Accueil } from './components/pages/accueil/accueil';

export const routes: Routes = [
  {
    path: 'accueil',
    title: 'Ô Cheval Radiant - Association d\'équithérapie et projets coopératifs à Maroilles',
    loadComponent: () =>
      import('./components/pages/accueil/accueil').then(m => m.Accueil)
  },
  {
    path: 'a-propos',
    title: 'À propos d\'Ô Cheval Radiant',
    loadComponent: () =>
      import('./components/pages/a-propos/a-propos').then(m => m.APropos)
  },
  {
    path: 'equipe',
    title: 'Rencontrez notre équipe',
    loadComponent: () =>
      import('./components/pages/equipe/equipe').then(m => m.Equipe)
  },
  {
    path: 'chevaux',
    title:'Nos chevaux, partenaires de soin',
    loadComponent: () =>
      import('./components/pages/chevaux/chevaux').then(m => m.Chevaux)
  },
  {
    path: 'bienfaits',
    title:'Les bienfaits de l\'équithérapie',
    loadComponent: () =>
      import('./components/pages/bienfaits/bienfaits').then(m => m.Bienfaits)
  },
  {
    path: 'accompagnements',
    title:'Nos accompagnements',
    loadComponent: () =>
      import('./components/pages/accompagnements/accompagnements').then(m => m.Accompagnements)
  },
  {
    path: 'experiences',
    title:'Vos retours d\'expériences',
    loadComponent: () =>
      import('./components/pages/experiences/experiences').then(m => m.Experiences)
  },
  {
    path: 'projets',
    title:'Nos projets coopératifs',
    loadComponent: () =>
      import('./components/pages/projets/projets').then(m => m.Projets)
  },
   {
    path: 'partenaires',
    title:'Nos partenaires engagés',
    loadComponent: () =>
      import('./components/pages/partenaires/partenaires').then(m => m.Partenaires)
  },
  {
    path: 'contact',
    title: 'Contactez-nous !',
    loadComponent: () =>
      import('./components/pages/contact/contact').then(m => m.Contact)
  },
  {
    path: 'mentions-legales',
    title: 'Mentions légales',
    loadComponent: () =>
      import('./components/pages/mentions-legales/mentions-legales').then(m => m.MentionsLegales)
  },
  {
    path: 'politique-confidentialite',
    title: 'Politique de confidentialité',
    loadComponent: () =>
      import('./components/pages/politique-confidentialite/politique-confidentialite').then(m => m.PolitiqueConfidentialite)
  },
  {
    path: 'conditions_utilisation',
    title: 'Conditions d\'utilisation',
    loadComponent: () =>
      import('./components/pages/conditions-utilisation/conditions-utilisation').then(m => m.ConditionsUtilisation)
  },
  { path: '**', component: Accueil }
];
