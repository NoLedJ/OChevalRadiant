# Google Maps / RGPD — préparation v1.2.1

Branche : `codex/google-maps-rgpd`, depuis main
`e5c382a30bd50bf20d9e26ca1fb4a8fb6359b539` (v1.2.0 et correctifs SEO).
La version du paquet et celle du lockfile sont préparées en **1.2.1**.
Ce changement est proposé en PR ; aucune fusion, livraison, modification Hostinger,
création de tag ou de Release n’en fait partie.

## Comportement et revue

- Google Maps est absent du DOM avant activation : seulement un SVG local original.
  Aucun préchargement ni préconnexion Google n’est ajouté.
- Un signal Angular propre au composant conserve le choix uniquement en mémoire.
  Le rechargement et le retour sur Contact réinitialisent ce choix. Aucun cookie,
  localStorage, sessionStorage ou service partagé de consentement.
- Un seul bouton HTML transparent couvre l’aperçu, avec son libellé visible en bas.
  L’image et le libellé activent donc la même action, sans doublon au clavier ou
  pour les lecteurs d’écran. Le focus reste sur le même bouton après activation
  et masquage ; état ARIA et description RGPD sont associés au contrôle.
- L’iframe est créée uniquement après activation et détruite au masquage. Son URL,
  son titre accessible, le plein écran et sa hauteur de 350 px sont conservés.
- L’aperçu v2, ses coins arrondis, son ombre et son bouton en bas sont conservés.
  Le zoom interne utilise le facteur 1,03, l’entrée 0,5 s, la sortie 0,3 s et la
  courbe cubic-bezier(0.4, 0, 0.2, 1). Le cadre ne change pas de dimensions.
  Le zoom de l’aperçu est désactivé avec `prefers-reduced-motion: reduce` ; le
  zoom d’origine de l’iframe après activation reste inchangé.
- Le texte d’information demandé, le lien vers la confidentialité et le lien Maps
  explicite dans un nouvel onglet sont présents. Adresse et contacts restent lisibles.
- Le site étant CSR, le repli `noscript` est dans le shell `src/index.html` :
  adresse, téléphone, e-mail et lien Maps accessibles sur les routes CSR sans JS.
  Le générateur 404 exclut ce repli, car sa page possède déjà son contenu rendu.
  `public/404.html` est régénéré par le build habituel ; `.htaccess` est inchangé.
- Le conteneur Contact limite le débordement horizontal préexistant. Le titre et
  le bloc Coordonnées restent identiques à main dans les comparaisons d’images.
  Le CTA animé et son espace avant le footer sont inchangés.

## Textes RGPD et droits cartographiques

La confidentialité et les mentions légales décrivent le chargement volontaire,
le fournisseur Google, les données techniques possibles, les cookies éventuels
après activation, les transferts internationaux possibles et l’absence de
mémorisation du choix. Les anciennes affirmations absolues sur l’anonymat,
l’absence de cookies et de transferts hors UE sont corrigées. Aucune durée de
conservation ou garantie de localisation des traitements Google n’est inventée.

Les sources du fournisseur ont été revérifiées le 4 novembre 2026 :
[confidentialité](https://policies.google.com/privacy?hl=fr),
[cookies](https://policies.google.com/technologies/cookies?hl=fr) et
[transferts](https://policies.google.com/privacy/frameworks?hl=fr).

L’aperçu `public/images/contact-location.svg` est un plan **schématique original,
sans échelle** : aucun tracé, tuile ou jeu de données tiers n’est réutilisé. Il
ne constitue pas un itinéraire. L’autorisation de réhéberger une capture pour cet
usage n’a pas été établie avec certitude ; cette alternative évite de livrer une
capture aux droits incertains. Les
[règles géographiques Google](https://about.google/brand-resource-center/products-and-services/geo-guidelines/)
et les [conditions Maps](https://www.google.com/intl/fr_fr/help/terms_maps/)
prévoient des usages sous conditions et imposent notamment les attributions.
L’iframe conserve celles de Google et de ses fournisseurs.

Réserves : masquer retire l’iframe mais n’efface pas les données déjà transmises
ou d’éventuels cookies Google. Leur présence après activation dépend notamment
des paramètres de l’utilisateur ; aucune absence générale de traceurs Google
n’est affirmée. Les champs d’identification de l’hébergeur, déjà vides sur main,
restent à compléter séparément avant une revue juridique globale du site.

## Validation finale locale

| Contrôle | Résultat |
| --- | --- |
| TypeScript et compilateur Angular (`npm run typecheck`) | Réussi |
| Tests Angular (`npm run test:ci`) | 56 réussis, dont 9 Contact |
| Build de production, SEO et 404 | Réussi, sans avertissement de budget |
| Audit production | 0 vulnérabilité |
| Audit global au seuil high | Réussi : 8 modérées d’outillage préexistantes, 0 élevée/critique |
| Contrôles Chrome, 1440 / 768 / 390 / 320 px | Réussis |
| Réseau avant activation | 0 requête externe, uniquement des ressources locales |
| Navigation / rechargement / stockage | Désactivation et absence de persistance validées |
| Tab, Entrée, Espace et taps sur mobile émulé | Réussis |
| Mouvement réduit et focus visible, 1440 / 390 px | Réussis |
| Sans JavaScript, 1440 / 390 px | Adresse et lien Maps disponibles, aucun iframe ni appel Google |

Les tests Angular couvrent l’état initial, l’URL exacte, le masquage, le contrôle
unique, la nouvelle instance, la navigation Angular et l’absence de lecture ou
écriture de stockage et de cookies pour le choix. Les contrôles navigateur
comparent le cadre et les blocs inchangés à une copie compilée de main. Le cadre
reste à 552 × 350, 336 × 350, 358 × 350 et 293 × 350 px respectivement : position
et dimensions identiques avant/après activation. Les captures du H1 et des
Coordonnées sont identiques octet par octet à main aux quatre largeurs.

Le contrôle Apache Ubuntu n’est pas simulé par le serveur statique local : il
est exécuté par le workflow `PR validation` sur Ubuntu 24.04. Le statut et les
journaux du dernier SHA de la PR font foi pour la validation distante : tests,
build, Apache et audits. Aucun déploiement ne figure dans ce workflow.
La recette locale ne remplace pas une validation sur tous les navigateurs ou
sur des appareils physiques.

## Captures et preuves

- [Aperçu desktop](images/maps-rgpd/contact-desktop.png)
- [Aperçu mobile](images/maps-rgpd/contact-mobile.png)
- [Survol desktop](images/maps-rgpd/hover-desktop.png)
- [Survol mobile émulé](images/maps-rgpd/hover-mobile.png)

Les journaux, fichiers HAR de profils isolés et scripts de recette restent hors
Git dans `tmp/maps-final/functional`, `tmp/maps-final/motion` et `tmp/maps-final`.
Les préparations précédentes dans `tmp/maps-rgpd`, `tmp/maps-rgpd-v2` et
`tmp/maps-zoom` restent conservées. Les contrôles navigateur utilisent le
Playwright déjà fourni par l’environnement, sans dépendance ajoutée au projet.
