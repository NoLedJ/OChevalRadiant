# SEO v1.2.0 — 3 novembre 2026

**Suite au NO-GO Hostinger :** le [diagnostic et correctif 404 LiteSpeed](seo-404-litespeed.md) décrit l'incident, le nouveau contrat HTTP et les validations locales du correctif. La production a été rétablie en v1.1.0. Les 238 contrôles et comparaisons de la préparation initiale ci-dessous restent des résultats historiques Apache, pas une validation LiteSpeed. Le correctif est préparé séparément sur `codex/fix-seo-404` depuis main `3701014410ec3d0773de91605a5d18e1bc6b8807`, sans livraison.

Branche `codex/seo`, worktree isolé depuis main/v1.1.0 (`4149523029f4bf7765c7e0d5f78b6a82b606ef5d`). Préparation de la PR v1.2.0 vers main ; version applicative et racine du lockfile alignées sur **1.2.0**, sans changement des versions de dépendances. Aucun changement Hostinger ou DNS, déploiement, tag ni Release. La PR ne doit pas être fusionnée dans le cadre de cette étape.

## Architecture conservée

Angular 22 reste **statique CSR**, sans serveur Node en production, SSR ou nouvelle dépendance npm. Les contenus, galeries et données existants sont conservés ; les titres de document et descriptions évoluent intentionnellement. La page inconnue ne renvoie plus le composant Accueil. Le seul document 404 est capturé au build depuis le rendu des composants réels, pour rester complet sans JavaScript. Le menu commun reçoit des commandes HTML natives ; le CTA interne de l'accueil est extrait en composant partagé, sans changement de son style.

`src/app/seo-pages.json` est la source unique des titres/descriptions des 13 pages. Le routeur utilise ses titres, et `SeoTitleStrategy` actualise description, robots, Open Graph et un canonical unique à chaque navigation. Langue française explicite. Les paramètres de campagne et fragments ne figurent jamais dans le canonical.

`npm run build -- --configuration production` transmet ses arguments à Angular puis génère les métadonnées de chaque route dans des **copies du même shell Angular**, sous `_seo/`. Il ne rend pas le contenu des composants : ce n'est pas du SSR ni du prerender Angular. Les réponses HTTP initiales ont ainsi leurs propres title, description, canonical et Open Graph, y compris pour les clients qui ne lisent pas JavaScript. Le contenu principal reste rendu par Angular.

Le même post-traitement crée de vrais fichiers `robots.txt` et `sitemap.xml` dans l'artefact. Le sitemap contient exactement les 13 URL canoniques, y compris les pages légales, sans date lastmod inventée. Robots autorise les ressources nécessaires au rendu et déclare le sitemap. Ces fichiers sont générés par du code versionné, pas maintenus manuellement en double dans public.

**Déploiement futur indivisible :** publier les shells `_seo/`, les ressources, robots, sitemap et 404 avant de basculer la configuration de routage/index. Les shells restent des ressources internes ; leurs accès directs répondent en 404. Ajouter une page exige de mettre à jour routes, catalogue SEO et liste des routes de `.htaccess`, puis de rejouer les tests. Conserver les anciennes ressources selon la procédure de livraison habituelle.

## Réponses HTTP et redirections proposées

`.htaccess` conserve les règles de compression, cache et sécurité existantes. MultiViews et listings de répertoire sont désactivés. Le cache sans stockage est appliqué à tous les HTML, pas seulement index.html.

- `/` : shell d'accueil, 200.
- Les 12 autres routes exactes : réécriture interne vers leur shell avec `[END]`, 200 et métadonnées propres à la page. Les accès directs et rechargements restent fonctionnels.
- URL inconnue, sous-chemin inexistant et ressource absente : **404 réel**, document d'erreur français `404.html`, `noindex, follow` et lien d'accueil. Depuis le correctif du NO-GO, un accès direct au fichier technique `/404.html` répond en **200**, avec noindex, sans canonical ni entrée sitemap. Il termine le traitement ; il ne provoque plus lui-même de 404. Aucune dépendance à `REDIRECT_STATUS`, aucun `R=404` global.
- Un faux chemin visité dans une session Angular affiche la page introuvable et passe à noindex, sans canonical obsolète. JavaScript ne peut pas changer rétroactivement le statut HTTP du document initial : le vrai 404 est garanti sur requête complète sous le serveur configuré.
- Slash final des routes connues : 301 vers leur forme sans slash. `/index.html` : 301 vers `/`. Pas de redirection globale des chemins inconnus vers l'accueil.
- Nom de production uniquement : HTTP et www redirigés en 301 vers **https://ochevalradiant.com**, avec conservation du chemin et de la query. localhost est exclu pour la recette. L'origine cible est constante, sans redirection ouverte fondée sur un Host arbitraire.
- Le code utilise l'état TLS réel `%{HTTPS}` ; un `X-Forwarded-Proto` forgé par le client ne contourne pas la redirection. Ne pas adapter cette règle pour un proxy sans déterminer précisément quels en-têtes sont fiables.

Observation publique en lecture seule le 3 novembre 2026 : les deux noms résolvent vers la même IPv4 et leurs certificats HTTPS sont acceptés par le client de test. Actuellement HTTP apex redirige vers HTTPS apex ; HTTP www vers HTTPS www ; les deux HTTPS répondent en 200. La duplication www/apex est donc confirmée. Aucune règle distante n'a été changée.

Avant une éventuelle livraison : revalider DNS et certificat des deux noms, l'état `%{HTTPS}` derrière le frontal Hostinger, les redirections hPanel déjà actives, et l'absence de boucle. Une redirection hPanel précédant `.htaccess` peut produire deux sauts ; les combinaisons www + slash peuvent aussi en produire deux. Ne pas promettre une chaîne d'un seul saut sans contrôle réel.

## Validations exécutées

- Installation du lockfile inchangé ; aucune dépendance ajoutée. Compilations application et tests réussies.
- **48/48 tests Angular réussis**, soit les 31 existants, 14 tests d'intégration SEO, 2 tests de la 404 dans le layout réel et un test des commandes natives du menu : header/footer uniques, focus sur le titre, retour Angular à l'accueil, restauration des métadonnées, ouverture/fermeture native. Les tests SEO couvrent chacune des 13 pages, query/fragment, canonical unique, description, français, noindex des inconnus puis restauration d'une page connue.
- Build production final réussi, avec 13 en-têtes statiques, robots et sitemap. Les options de build sont transmises au CLI Angular par le wrapper, sans être absorbées par le post-traitement.
- **238 contrôles HTTP sous Apache 2.4.69 réel sur Windows** : contenu des métadonnées sans exécution JavaScript, 13 pages HTTP et HTTPS, 301 slash/index/www/HTTP, queries conservées, X-Forwarded-Proto non fiable, vrais 404 (GET/HEAD, HTTP/HTTPS), XML et robots valides, protection .htaccess, cache HTML. **166 fichiers publics servis identiques octet par octet au build**. Les dix cas d'erreur (dont JS, CSS, image et police absents) servent exactement le document 404 généré, sans cache HTML ni canonical.
- TLS local avec un certificat de test explicitement approuvé par le seul client Python ; aucune modification de la confiance Windows. Apache portable lié à 127.0.0.1 uniquement, sans service installé. Archive fournisseur vérifiée par SHA-256, distribution référencée dans la documentation Apache.
- Recette navigateur locale Chrome : 13 pages, métadonnées uniques et canonicals corrects, menu mobile, navigation/historique, galerie et fermeture Échap, page inconnue CSR puis retour à l'accueil. Aucune erreur JavaScript observée. Les services tiers sont bloqués dans ce contexte ; Maps n'est pas revalidé.

## Page 404 intégrée au site

Le composant `NotFound`, cible de la wildcard finale, réutilise **les vrais Header et Footer du layout App**, sans les instancier une seconde fois. Les 13 routes et leur catalogue SEO restent inchangés. La composition centrale et la photographie existante sont conservées ; l'eyebrow est entièrement supprimé. Aucune dépendance ni image externe ajoutée.

Le CTA principal utilise `ActionLink`, extrait du bouton Contact de l'accueil : même HTML d'ancre/SVG, mêmes classes globales `button text-sm`, mêmes styles bruns, padding, rayon, hauteur de 40 px et interactions hover. L'accueil utilise lui aussi ce composant. Son libellé et sa destination changent naturellement selon la page ; sa largeur reste déterminée par le texte. Les boutons Facebook de Contact et du footer restent les vrais `FacebookButton`, inchangés. Aucun style de bouton spécifique à la 404 ne subsiste.

Un seul H1 nomme la région d'erreur. Angular place le focus sur ce titre après rendu, sans imposer de défilement ; Tab atteint ensuite le CTA. Les liens ont de vrais href utilisables sans interception Angular. Le logo commun devient une ancre native, avec les mêmes dimensions et styles hérités que son ancien div. La photo conserve son texte alternatif. La mise en page passe en colonne sur mobile.

### Génération sans copie du design

`npm run build` compile Angular, génère les en-têtes SEO, puis lance `scripts/build-404.mjs`. Un serveur de capture éphémère lié à 127.0.0.1 sert **ce même build** à Chrome Headless dans un profil temporaire isolé. La route inconnue monte App, Header, NotFound, ActionLink, Footer et leurs sous-composants réels. Leur DOM rendu et leurs styles compilés sont sérialisés, après vérification du montage, du noindex, de l'absence de canonical et de l'unicité header/footer. Une capture incomplète fait échouer le build.

Le résultat remplace `public/404.html` et son exemplaire dans le build. Il n'y a plus de template manuel du header/footer, de feuille CSS parallèle, ni de copie manuelle des données. La feuille globale compilée est intégrée à l'identique ; les styles encapsulés proviennent d'Angular. Le `<base href="/">` conserve les bonnes ressources depuis les chemins imbriqués. Les scripts de l'application restent présents : avec JavaScript, le bootstrap CSR reprend ; sans JavaScript ou avec les bundles indisponibles, le DOM complet reste affiché et les liens/menu natifs restent utilisables. Le contenu principal des 13 pages connues reste CSR, comme auparavant.

La capture exige Chrome local (`CHROME_BIN` ou chemin système courant). La CI localise Chrome et définit CHROME_BIN avant tests/build ; aucune nouvelle dépendance npm ni workflow de publication ajouté. La CI existante couvre cette étape sur Ubuntu ; contrôler son résultat réel sur le dernier SHA de la PR corrective. `node scripts/build-404.mjs` permet de régénérer le seul document après compilation. Ne pas éditer le HTML généré ni livrer un exemplaire provenant d'un autre build : il référence les ressources compilées correspondantes. Le résultat HTML est stable lors de deux générations locales consécutives ; l'identité binaire entre systèmes/versions Chrome n'est pas garantie.

### Même menu avec et sans JavaScript

Le composant Header commun monte toujours PopUpMenu ; le conteneur `popover="auto"` est masqué nativement tant qu'il n'est pas ouvert. Les boutons existants utilisent `popovertarget` pour ouvrir/fermer, avec les mêmes classes, contenus et styles. Le panneau conserve 250 px de large et 100dvh de haut, les mêmes positions, fond, voile et animations. Son conteneur utilise 100vw, comme l'ancien header, pour éviter un décalage dû à la barre de défilement.

Ouverture, fermeture, clic sur le voile et Échap fonctionnent nativement sans script. En Angular, un lien du menu ferme le popover puis conserve la navigation CSR. Sans JavaScript, le lien recharge sa destination, ce qui referme naturellement le menu. La fermeture ramène le focus au bouton d'ouverture ; l'entrée se fait sur « Fermer le menu ». C'est une amélioration commune à toutes les pages, nécessaire pour éviter une seconde implémentation du menu. Les animations respectent désormais prefers-reduced-motion. Le support natif Popover du navigateur est requis ; Chrome a été testé, Safari/iOS et les navigateurs anciens restent à recetter. Références : [standard HTML Popover](https://html.spec.whatwg.org/multipage/popover.html), [Chrome Headless](https://developer.chrome.com/docs/automation-and-testing/headless).

### Comparaison avec Contact et écarts restants

Comparaisons au même viewport **1440 × 1000** et **375 × 1000**, polices chargées et transitions terminées :

- Header : mêmes contenus, styles calculés et hauteur (64,8 px) sur Contact et 404. Seul Contact possède son surlignage actif de navigation ; aucune page connue n'est active sur une 404.
- Footer : mêmes contenus, styles calculés et dimensions (hauteur 387,712 px sur ordinateur, 901,713 px sur mobile). Sa position verticale dépend normalement de la hauteur du contenu principal. Les captures recadrées peuvent différer d'un pixel à cause de l'origine sous-pixel ; cela ne correspond pas à un padding ou une dimension différents.
- CTA 404 Angular/sans JS : styles et dimensions identiques. La largeur diffère du bouton Contact de l'accueil lorsque son libellé diffère ; aucune largeur arbitraire ni hauteur propre à la 404.
- La capture complète 404 sur ordinateur est **identique octet par octet** avec et sans exécution JavaScript. Sur mobile, l'analyse PNG trouve 3 941 pixels différents, limités aux deux logos JPEG ; les fichiers sources, positions et dimensions sont identiques, et les textes, CTA et composition ne présentent pas cet écart. Une différence de décodage/rastérisation Chrome est une hypothèse, non une cause établie. Aucun remplacement du logo n'a été fait pour masquer cet écart.
- Panneau mobile Angular/sans JS : mêmes coordonnées x=125,2 px, largeur 250 px et hauteur 1000 px à ce viewport. Ouverture, fermeture, Échap et voile validés dans les deux modes ; retour accueil sans JS en HTTP 200. Absence de débordement de la 404 également contrôlée à 320 px.

Le statut reste **404 réel** pour document inconnu et ressources absentes ; aucune redirection automatique. `/404.html` est désormais l'exception technique 200 décrite plus haut. Le `noindex, follow` et l'absence de canonical sont identiques dans le document généré et la stratégie Angular. La recette historique Apache comptait 238 requêtes et 166 ressources ; celle du correctif est détaillée dans le rapport LiteSpeed. Les 13 routes restent en 200 avec leurs en-têtes SEO propres. Aucune exception JavaScript observée dans la recette ciblée. Les erreurs console liées aux réponses HTTP 404 et au blocage volontaire des tiers ne sont pas des exceptions applicatives.

Les tests, compilations et build sont validés. Un premier passage du test de retour accueil a nécessité un `fixture.detectChanges()` après navigation pour rendre les inputs du composant CTA nouvellement partagé ; le passage final compte 48 succès. Le warning Karma préexistant `404: /768w` persiste, sans échec ; la photo 404 n'utilise pas srcset.

Les preuves précédentes restent conservées dans `tmp/seo/404-validation`. Les copies des sources avant intervention, captures Contact/404, comparaisons chiffrées, journaux et contrôles HTTP sont **hors Git** dans `tmp/seo/404-integration` du dépôt principal ; les validations de préparation de la PR sont dans `tmp/seo/pr-v1.2.0`. Cette recette ne remplace pas un audit lecteur d'écran ni une recette du frontal Hostinger, qui exigera une livraison expressément autorisée.

## CI de la PR et audits

Le workflow `PR validation` sur Ubuntu 24.04 conserve Node 24.19.0, l'installation reproductible avec `npm ci --ignore-scripts --no-audit --no-fund`, les compilations, les 48 tests ChromeHeadless, le build complet et les deux audits. `npm audit --omit=dev` ne tolère aucune alerte de production ; `npm audit --audit-level=high` bloque les vulnérabilités élevées/critiques et les erreurs d'audit. Les huit alertes modérées d'outillage connues d'Angular 22 sont documentées dans `docs/migrations/angular22.md` ; elles ne sont pas corrigées par ce chantier SEO et aucun audit fix n'est exécuté.

La CI installe uniquement sur son runner Apache/OpenSSL, puis exécute `scripts/check-http-seo.sh`. Ce script lance un Apache indépendant non privilégié sur 127.0.0.1:4390/4391/4392, avec sa propre configuration, un certificat local temporaire et AllowOverride All. Le troisième listener simule une redirection HTTPS en amont ; une injection d'environnement reste exclusivement dans cette configuration de test. La matrice renforcée compte 383 requêtes sur le build courant, puis le script arrête son propre serveur à la sortie. Aucun secret, accès SSH/FTP, compte Hostinger, DNS ou automatisation de publication n'est utilisé. Les résultats réels de la CI Ubuntu sont à vérifier sur le SHA final de la PR corrective, pas déduits des seuls succès locaux.

Reproduction, après lancement d'un Apache avec AllowOverride All et les modules requis servant `dist/ocheval-radiant/browser` :

```text
npm ci --ignore-scripts --no-audit --no-fund
npm run typecheck
npm run test:ci
npm run build -- --configuration production
python scripts/check-http-seo.py --http http://127.0.0.1:4390 --https https://127.0.0.1:4391 --ca ../localhost.crt
```

Configurer CHROME_BIN si nécessaire. La configuration Apache, le certificat/sa clé locale, les journaux et preuves sont conservés hors Git dans `tmp/seo` du dépôt principal. Ne jamais publier ces outils ou la clé avec le build. Les refus d'accès à .htaccess dans le journal Apache sont attendus par le test, pas des erreurs applicatives.

## Limites et risques avant Hostinger

- Apache Windows ou Ubuntu n'est pas le frontal LiteSpeed/Hostinger : vérifier prise en charge `[END]`, `Options`, ErrorDocument, AllowOverride, modules, MIME et conservation du 404 après traitement d'erreur. LiteSpeed documente une sémantique de `[L]` différente d'Apache : le succès de la matrice Apache ne certifie donc pas le parcours des réécritures sur le serveur Hostinger réel. Ne pas remplacer `[END]` par `[L]`, ni ajouter des branches spécifiques LiteSpeed, sans recette du serveur cible. Le système de fichiers Windows est moins strict sur la casse que Linux ; respecter exactement les noms générés.
- Les règles hPanel de redirection/HTTPS et le frontal peuvent agir avant `.htaccess`. Documenter leur état lors d'une livraison autorisée, ainsi que le certificat de www et apex, puis vérifier les quatre origines HTTP/HTTPS × www/apex avec chemins connus, inconnus et paramètres. Une règle hPanel opposée à l'apex choisi peut provoquer une boucle ; une règle concordante peut ajouter un saut. Une terminaison TLS en amont mal reflétée par `%{HTTPS}` peut également boucler. Ne pas désactiver Force HTTPS, faire confiance à un X-Forwarded-Proto quelconque, toucher aux DNS ou modifier hPanel dans le cadre de cette PR. Les 301 sont persistants dans les clients : recette en contexte vierge et sauvegarde préalable indispensables avant une future mise en production.
- `ng serve`, `ng build` invoqué directement et la commande watch historique ne reproduisent pas le post-traitement SEO de `npm run build`. Tester la livraison sur le build complet sous Apache, pas sur le fallback du serveur de développement. La génération suppose le chemin de sortie configuré du projet ; un outputPath personnalisé exige une adaptation explicite.
- Ces tests locaux ne prouvent ni l'indexation Google ni le rendu de tous les robots. Le corps des pages dépend toujours de JavaScript ; les métadonnées HTTP propres aux pages ne rendent pas leur contenu. Les canonicals sont des signaux, pas une obligation pour les moteurs.
- Les règles proposées ne sont pas encore appliquées en production : les faux 200 et la duplication www peuvent donc rester observables jusqu'à une livraison autorisée. Ne pas déclarer la production corrigée sur la base de cette recette.
- La CI de cette PR couvre Ubuntu/Apache ; elle ne remplace pas les recettes Safari/iOS/Opera, URL Inspection Search Console et soumission du sitemap, qui restent à effectuer dans leurs périmètres autorisés. Aucun compte Search Console n'a été modifié.
- Maps/RGPD, accessibilité et débordement mobile Contact préexistants restent hors périmètre. Les huit alertes modérées d'outillage de v1.1.0 ne sont pas modifiées par cette étape ; aucun npm audit fix.

Pour revenir en arrière après une livraison future, restaurer la configuration et l'index sauvegardés avec les anciens fichiers réellement publiés, garder les chunks nécessaires aux sessions ouvertes, puis recontrôler les routes et statuts. L'ancien fallback réintroduirait les faux 200 : ce serait un retour arrière explicite, pas une solution SEO.

Références : [drapeaux Apache mod_rewrite](https://httpd.apache.org/docs/2.4/rewrite/flags.html), [différences de réécriture LiteSpeed/Apache](https://docs.litespeedtech.com/lsws/cp/cpanel/switch-apache/#rewrite-rule-l-flag), [boucles SSL et redirections Hostinger](https://www.hostinger.com/support/2197891-how-to-fix-ssl-redirect-loop-at-hostinger/), [HTTPS chez Hostinger](https://www.hostinger.com/support/1583201-how-to-enable-or-disable-https-for-your-website-at-hostinger/), [Apache sous Windows](https://httpd.apache.org/docs/2.4/platform/windows.html), [Google et le SEO JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [canonicals Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
