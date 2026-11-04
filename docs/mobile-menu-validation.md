# Menu mobile — préparation v1.2.2 et recette du 4 novembre 2026

Branche : `codex/fix-mobile-menu-scroll`. Base : `main`, tag `v1.2.1`,
commit `88a4c82d7197caf99ae903469c842adabae7bf42`.

## Comportement

La liste des dix liens possède sa propre zone de défilement, limitée à l'espace
restant dans le panneau. Le bouton de fermeture conserve ses 40 px et reste
au-dessus de cette zone. Une marge inférieure protège le contour de focus du
dernier lien. Le panneau reste large de 250 px, dans la limite de l'écran.

Le popover `auto`, ses commandes HTML, ses animations de 0,5 s et son traitement
de `prefers-reduced-motion` sont conservés. Les liens mobiles ont un `tabindex=0`
explicite pour permettre la tabulation aussi sur WebKit lorsque son réglage
par défaut omet les liens. Les liens desktop gardent leur comportement natif.

Les quatre `safe-area-inset-*` protègent le contenu du panneau et la meta viewport
active `viewport-fit=cover`. Le verrouillage de `html` et `body` dépend directement
de `:popover-open` ; fermer par bouton, arrière-plan, Échap ou lien libère donc le
défilement. `overscroll-behavior` contient le défilement de la liste.

## Résultats

Environnement : Windows, Playwright 1.64.1, Chrome 156.0.8078.80,
Edge 156.0.4314.58 et WebKit 27.2.

| Vérification | Résultat |
| --- | --- |
| `npm run typecheck` | Réussi |
| `npm run test:ci` | 58 tests réussis, dont 2 nouveaux |
| `npm run build` | Réussi, y compris rendu Chrome de la page 404 |
| `npm run test:html` | 5 tests réussis |
| `npm run test:e2e` | 33 tests réussis ; 3 cas WebKit exclus car leur instrumentation utilise Chromium |
| `git diff --check` | Réussi |

| Scénarios navigateur | Couverture |
| --- | --- |
| 320×568, 390×844, 568×320, 844×390 | Les 10 liens sont parcourus avec Tab et Maj+Tab, leur visibilité et celle du bouton sont mesurées ; Chrome, Edge, WebKit |
| Rotation menu ouvert | Passage 390×844 → 844×390, dernier lien accessible ; les trois moteurs |
| Clavier et focus | Entrée ouvre/ferme ; autofocus sur Fermer ; Échap ferme et rend le focus au bouton d'ouverture quand il était focalisé ; les trois moteurs |
| Arrière-plan | Molette sur la liste puis sur le fond, position de page préservée ; fermeture et défilement de page à nouveau possible ; les trois moteurs |
| Tactile | Balayages simulés dans la liste et sur le fond ; Chrome et Edge avec contexte mobile/tactile |
| Navigation | Les 10 destinations, activation par Entrée, lien de la page courante et retour navigateur ; fermeture et libération du défilement ; les trois moteurs |
| Zoom natif 200 % | Chrome et Edge avec préférence de zoom du navigateur ; fenêtres 390×844 et 568×320, largeurs CSS constatées de 195 et 284 px, 10 liens parcourus au clavier, dernier contour de focus visible |
| Safe areas | Valeurs CSS `env()` réellement surchargées via CDP : haut/bas 20 px, gauche/droite 16 px ; padding calculé et position du dernier lien vérifiés sur Chrome et Edge |
| Animations | Animation d'entrée présente ; absence d'animation avec réduction des mouvements ; les trois moteurs |
| Desktop | Navigation et défilement à 950, 1280 et 1440 px ; les trois moteurs |

Les trois exclusions WebKit concernent uniquement zoom natif, surcharge des safe
areas et injection des gestes tactiles, dont les tests utilisent des outils propres
à Chromium. WebKit est testé pour les autres scénarios. Cette recette est réalisée
sur moteurs automatisés sous Windows ; une validation sur appareil iOS physique
avec Safari et ses barres de navigateur reste distincte.

## Comparaison avec main

La base a été extraite avec `git archive main` puis compilée dans
`tmp/mobile-menu/baseline`, sans modifier la branche source. Les captures
comparatives utilisent Chrome, les mêmes dimensions et la réduction des
animations pour stabiliser l'image.

En 568×320, avant correction, Contact commence à **393,83 px**, au-delà de l'écran,
même après une demande de focus. Le bouton de fermeture est comprimé à **18 px**.
Après correction, le focus fait défiler la liste : Contact commence à **277,83 px**,
avec son contour visible, et le bouton garde ses **40 px**.

Les positions des liens et du bouton en 320×568 et 390×844 sont identiques à la
base. En desktop 1440×900, les fichiers PNG avant/après sont identiques :
**aucun pixel différent**.

## Captures et artefacts locaux

- [Avant, paysage 568×320](images/mobile-menu/before-568x320-top.png)
- [Après, début de liste](images/mobile-menu/after-568x320-top.png)
- [Après, dernier lien accessible](images/mobile-menu/after-568x320-bottom.png)
- [320×568](images/mobile-menu/chrome-320x568-top.png)
- [390×844](images/mobile-menu/chrome-390x844-top.png)
- [Paysage 844×390](images/mobile-menu/chrome-844x390-bottom.png)
- [Zoom 200 %, paysage](images/mobile-menu/chrome-zoom200-568x320.png)
- [Safe areas simulées](images/mobile-menu/chrome-safe-areas-568x320.png)
- [Desktop avant](images/mobile-menu/before-1440x900-top.png)
- [Desktop après](images/mobile-menu/after-1440x900-top.png)

Les mesures détaillées et le rapport local restent dans `tmp/mobile-menu/`. Le job
Ubuntu `mobile-menu` archive son rapport HTML et ses captures jointes dans l’artefact
`mobile-menu-browser-report` pendant 14 jours. Les captures ci-dessus sont versionnées
pour rester consultables directement dans la PR.

La recette initiale conservait uniquement les artefacts dans `tmp/`. Pour la PR
v1.2.2, les captures utiles sont jointes sous `docs/images/mobile-menu/` et
`public/404.html` est régénéré afin d’intégrer le même menu et les mêmes styles.

## Rejouer

Avec Chrome et Edge installés, exécuter les commandes successivement :

```sh
npm ci
npx playwright install webkit
npm run typecheck
npm run test:ci
npm run build
npm run test:html
npm run test:e2e
```

Playwright lance le serveur Angular sur `127.0.0.1:4317`, ou réutilise le serveur
local existant. Pour ne tester qu'un navigateur :
`npm run test:e2e -- --project=chrome`.

La PR prépare v1.2.2 uniquement. Aucune fusion, intervention Hostinger, livraison,
création de tag ou Release ne fait partie de cette préparation.
