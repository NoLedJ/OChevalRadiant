# v1.1.0 — Migration Angular 20 → 21 → 22

Préparation du 3 novembre 2026, branche `codex/migrate-angular22`, depuis main/v1.0.1 au commit `11464cdf58492f0dca4e3970072c426b69b90b41`. Versions applicatives (package.json et les deux métadonnées racines du lockfile) alignées sur **1.1.0**. Cette évolution est proposée en PR, sans fusion ni déploiement à cette étape.

## Méthode et changements

Deux passages successifs avec le CLI officiel, sans `--force` ni overrides :

```text
ng update @angular/core@21 @angular/cli@21 --create-commits=false
ng update @angular/core@22 @angular/cli@22 --allow-dirty --create-commits=false
```

`--allow-dirty` au second passage conserve les changements non committés du premier dans ce seul worktree. Les manifests/lockfiles et validations de l'étape 21 sont sauvegardés séparément. `NG_CLI_ANALYTICS=false`, installation avec scripts npm désactivés. Une installation reproductible finale `npm ci --ignore-scripts --no-audit --no-fund` a été validée.

| Élément | v1.0.1 | Étape 21 | Final |
|---|---|---|---|
| Framework/compiler-cli | 20.3.35 | 21.2.26 | 22.2.4 |
| CLI/build | 20.3.42 | 21.2.29 | 22.2.5 |
| TypeScript | 5.9.3 résolu | 5.9.x | 6.0.3 |
| Node / npm utilisés | 24.19.0 / 11.17.0 | identiques | identiques |

Les migrations obligatoires 20 → 21 ne modifient pas les sources. En 22 :

- `App` et `Carousel` reçoivent explicitement `ChangeDetectionStrategy.Eager`, pour préserver leur comportement antérieur au changement de défaut d'Angular 22. Les composants OnPush restent inchangés.
- Les configurations application/tests suppriment les deux diagnostics étendus `nullishCoalescingNotNullable` et `optionalChainNotNullable`, conformément à la migration officielle. `strictTemplates: true` et la compilation stricte restent actifs. Ce choix réduit ces avertissements ; leur réactivation éventuelle doit être étudiée séparément.
- **Seule nouvelle dépendance directe : `istanbul-lib-instrument ^6.0.3`, de développement**, ajoutée par la migration officielle du CLI pour les projets Karma. Elle répond à un besoin explicite de l'outillage de couverture, sans ajout au runtime.
- TypeScript 6.0.3 est nécessaire à Angular 22. Les autres nouvelles dépendances transitives viennent des contraintes de la chaîne officielle Angular, sans substitution forcée.
- Le commentaire CI est actualisé pour les alertes résiduelles ; ses commandes, Node, runner et seuils de blocage restent inchangés. Fin de ligne finale de package.json rétablie après migration.

## Compatibilités et architecture

Angular 21 requiert TypeScript >=5.9 <6 ; Angular 22 requiert >=6.0 <6.1. Node 24.19.0 satisfait les plages publiées des deux versions ; Angular 22 accepte notamment ^24.15.0 (autres branches : ^22.22.3 ou >=26 selon les métadonnées npm). La CI conserve donc Node 24.19.0.

Karma **6.4.4** reste compatible avec le peer `^6.4.0` d'Angular build 22. Le builder `@angular/build:karma`, Jasmine et Chrome Headless sont conservés. La migration optionnelle vers Vitest n'a pas été exécutée.

`fslightbox-angular` **1.1.2**, inchangé, déclare Angular common/core >=16. Ce peer large ne remplace pas une validation réelle : compilations et tests réussissent, et les galeries Expériences et À propos ont été ouvertes et fermées après migration. Zone.js **0.15.1** et le fournisseur explicite `provideZoneChangeDetection` sont conservés.

Le site reste **statique CSR** : angular.json, routage, bootstrap, `.htaccess`, templates, styles et contenus ne changent pas. Aucun SSR, prerender, backend, Vitest ou bibliothèque applicative ajouté. Les pairs SSR optionnels du builder ne signifient pas que SSR est activé.

## Validations

| Contrôle | Angular 21 | Angular 22 |
|---|---|---|
| Compilation application et tests | Réussie | Réussie |
| Suite existante | 31/31 réussis | 31/31 réussis |
| Build production | Réussi | Réussi |
| Bundle initial brut | 325,75 kB | 330,90 kB |
| Transfert initial estimé | 94,37 kB | 94,48 kB |

Baseline v1.0.1 : 318,60 kB / 92,83 kB. L'augmentation finale est de 12,30 kB bruts et 1,65 kB estimés ; sous le budget d'avertissement 500 kB. Aucun avertissement de build relevé. `npm ls --all` : code 0, sans dépendance invalide ou manquante.

Comparaison des builds de production sur deux serveurs limités à 127.0.0.1, Chrome 156 sous Windows :

- 13 pages en accès direct sur ordinateur : textes, titres et H1 identiques ; polices, couleurs et dimensions des H1 identiques à la précision visuelle. Quelques différences de mesure pendant les animations sont inférieures à 0,001 px, sans changement de CSS.
- 13 pages comparées puis rechargées à 375 × 812 : textes, largeurs et styles des H1 identiques (arrondis à 0,01 px).
- Captures d'accueil ordinateur (1440 × 1000) et mobile (375 × 812) : fichiers PNG **strictement identiques octet par octet** entre baseline et Angular 22, également examinés visuellement.
- Menu mobile : ouverture, navigation vers Expériences et fermeture ; historique précédent/suivant validé en attendant explicitement les changements de route.
- Galerie Expériences : image chargée, largeur naturelle 4160 px, fermeture par Échap. Galerie À propos : ouverture/fermeture réussies ; carrousel de 14 images après rendu. Le clic sur le carrousel animé utilise une action forcée pour éviter l'attente de stabilité du sélecteur ; ce contrôle ne garantit pas son ergonomie complète.
- Aucune erreur JavaScript ou réponse locale >=400 observée lors du parcours ordinateur. Les tiers sont bloqués dans ce contexte de recette : Maps et liens externes ne sont pas revalidés ici.

Ces contrôles ne couvrent pas tous les navigateurs ni toutes les interactions. Le support navigateur minimal évolue avec la Baseline Angular 22 ; une recette Safari/iOS/Opera reste recommandée avant livraison. La CI réelle Ubuntu doit réussir sur la PR avant fusion ; son résultat et son lien d'exécution sont consignés dans la description de PR. Les validations Windows ci-dessus ne remplacent pas cette exécution.

## Audit npm et risques résiduels

Audit global : **8 modérées, 0 élevée/critique**, contre 22 modérées sur v1.0.1. Audit production : **0 alerte**. `npm audit --audit-level=high` : code 0 ; audit complet : code 1 attendu.

Un avis reste propagé : [minimatch GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), versions <11.0.1. Les huit paquets signalés sont `@angular/build`, `glob`, `karma`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`, `minimatch`, `rimraf`. Ils relèvent de l'outillage, pas du runtime statique. Risque de consommation de ressources avec motifs non fiables pendant build/test. Aucun override global minimatch 11 et aucune rétrogradation de Karma/build suggérée par npm n'ont été appliqués.

Les dépréciations inflight/rimraf/glob héritées de Karma restent présentes, ainsi que le 404 `/768w` des fixtures du bandeau pendant les tests. Le seuil CI high autorise aussi de nouvelles modérées : leur revue reste nécessaire. Une migration Vitest distincte pourrait réduire la dépendance à Karma, mais n'est pas requise pour cette étape.

Aucune régression fonctionnelle bloquante détectée dans les contrôles réalisés. Le débordement Contact à 379 px pour une fenêtre 375 px reste identique à la baseline. SEO/404, Maps/RGPD, accessibilité et coordonnées Contact en texte restent hors périmètre et inchangés.

## Preuves et suite

Les journaux de migrations, validations par étape, lockfile intermédiaire 21, audits, arbre de dépendances, comparaisons navigateur et captures sont conservés hors Git dans le dossier local `tmp/migrate-angular22` du dépôt principal. Ces fichiers temporaires sont exclus de la PR. Ce rapport est versionné avec les changements nécessaires à la migration.

Avant toute livraison : revue du diff, CI Ubuntu autorisée et réussie, recette des navigateurs cibles, puis nouveau build traçable et nouvelle sauvegarde de production. La PR ne doit pas être fusionnée à cette étape ; aucun tag, Release ou déploiement Hostinger ne fait partie de cette préparation.

Sources : [compatibilités Angular](https://angular.dev/reference/versions), [guide officiel](https://angular.dev/update-guide), métadonnées npm des versions précises installées, et journaux des migrations officielles.
