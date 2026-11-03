# Correctif local du NO-GO SEO v1.2.0

3 novembre 2026. Correctif proposé vers `main` depuis la branche `codex/fix-seo-404`, worktree `tmp/seo-404-fix/checkout` du dépôt principal, basé sur `3701014410ec3d0773de91605a5d18e1bc6b8807`. Version applicative inchangée, 1.2.0. Le périmètre comprend uniquement les règles d'erreur HTTP, leurs tests et cette documentation ; aucun code Angular, générateur SEO, dépendance ou workflow de publication ne change. Aucune fusion, intervention Hostinger, nouvelle version, tag ni Release dans cette étape. Les sauvegardes, preuves et autres worktrees sont conservés hors Git.

## Incident : observations et limites du diagnostic

**Confirmé, P1 :** la recette de livraison a obtenu un HTTP 500 LiteSpeed pour `GET https://ochevalradiant.com/404.html` le 3 novembre à 16:57:26 UTC (20:57:26 Réunion), après succès des 13 pages connues, de leurs métadonnées et empreintes. Réponse sans Location, corps de 800 octets, SHA-256 `59661d8459e67ecbe7ca8d096d8ecabe3bd20c4793bbd2963a410cd8f7214ebf`. La recette s'est arrêtée là : elle ne démontre pas que toutes les URL inconnues produisaient un 500, ni que toutes les redirections avaient été validées. Le succès Apache préalable n'avait pas détecté cette incompatibilité.

Preuves originales, relatives au dépôt principal, à ne pas écraser :

- `tmp/delivery-v1.2.0/production-checks/live-failure.json` : heure, en-têtes, statut et empreinte ; le corps intégral du 500 et le journal d'erreur serveur n'y figurent pas.
- `tmp/delivery-v1.2.0/BILAN-PRODUCTION.md`, `tmp/delivery-v1.2.0/production-checks/{rollback-final,deployment-status,quarantine-completed}.json` : retour arrière v1.1.0 contrôlé, 219 fichiers anciens restaurés/confirmés, 24 nouveaux bundles conservés et 15 fichiers de contrôle SEO mis en quarantaine hors `public_html`. Aucun de ces fichiers n'est modifié ici.
- Sauvegarde réellement publiée `production-v1.1.0-before-v1.2.0.zip`, SHA-256 `859982e0be6f60b69c185741fce3e6c2fb51ce1bb8171b80557c6d243f1fbbbb` ; `.htaccess` original brut, 2 324 octets, SHA-256 `9a222da8c5e3963c91ca48468c5d2154808208941dffa0e55620655a9e64db60`.

**Hypothèse principale, non démontrée sur LiteSpeed :** la règle de la v1.2.0 demandait un nouveau 404 sur le document chargé précisément pour traiter le 404 :

```apache
ErrorDocument 404 /404.html
RewriteCond %{ENV:REDIRECT_STATUS} !^404$
RewriteRule ^404\.html$ - [R=404,L]
```

Sous Apache, un statut `R=404` suit le traitement normal des erreurs, dont ErrorDocument ; il ne sert pas une substitution comme une redirection 301. Apache documente `REDIRECT_STATUS` lors de sa redirection interne d'erreur : la condition permettait donc normalement la sortie au second passage. Si LiteSpeed n'expose pas la même valeur au même moment, le document peut redéclencher l'erreur qu'il traite. La règle globale finale `R=404` ajoutait également un passage d'erreur pour chaque absence. Une limite de redirections internes/récursions est une explication plausible du 500, **pas un diagnostic serveur établi**.

Restent inconnus : version exacte et configuration LiteSpeed du vhost, valeur/phase effective de REDIRECT_STATUS, messages du journal serveur, éventuel filtre ou traitement d'erreur hPanel. Aucune reproduction du 500 LiteSpeed n'est revendiquée. Le fait que les 13 routes connues fonctionnaient écarte un rejet syntaxique global simple, sans exclure une directive problématique dans un chemin particulier. Le seul en-tête `Server: LiteSpeed` ne décrit pas l'ensemble du frontal.

## Solution retenue et contrat HTTP

Le document d'erreur devient un fichier terminal sans condition d'environnement :

```apache
ErrorDocument 404 /404.html
# Après la canonicalisation HTTPS/www, avant les routes :
RewriteRule ^404\.html$ - [END]
RewriteRule ^_seo(?:/|$) - [R=404,END,NC]
# Puis redirections index/slash et les 12 réécritures connues vers _seo/.
# Aucun fallback global ; laisser le serveur traiter les fichiers absents.
```

Les réécritures vers les shells conservent `[END]`. La seule erreur explicitement forcée protège les URL internes `_seo`, y compris une variante de casse ; sa cible d'erreur `/404.html` ne correspond pas à cette règle. Pas de `REDIRECT_STATUS` dans une condition, ni de `R=404` sur le handler ou de réécriture globale vers l'accueil. Un fichier absent déclenche le 404 natif, puis le document statique local ; une requête normale à un fichier existant reste servie normalement.

| Requête complète | Attendu sous la configuration corrigée |
| --- | --- |
| `/` et les 12 routes exactes | 200, français, métadonnées propres, canonical unique |
| URL inconnue, sous-chemin, JS/CSS/image/police absents | 404, corps identique au `404.html` construit, sans Location |
| Accès direct à `_seo/...` | 404, même document d'erreur |
| Accès direct à `/404.html` | **200 technique**, noindex, follow ; aucun canonical, aucune entrée sitemap |
| Slash final d'une route connue, `/index.html` | 301 vers la route canonique, paramètres conservés |
| HTTP ou www du domaine de production | 301 vers HTTPS apex, puis éventuelle normalisation du chemin |
| Fichier `.htaccess` | 403, accès interdit par le serveur de test ; à contrôler sur Hostinger |

Le 200 direct du fichier technique est un changement intentionnel par rapport au contrat initial. Il ne transforme pas les URL inconnues en faux 200 : le statut d'erreur leur appartient, et le fichier fournit uniquement le corps. Son noindex doit rester visible, le fichier ne doit être ni dans le sitemap ni utilisé comme lien public. Le comportement Angular wildcard, le header, le footer, la photographie, les CTA, le menu natif et le rendu sans JavaScript restent inchangés. Les 13 sources de métadonnées et tous les générateurs sont inchangés.

Autres solutions examinées : conserver un 404 direct via une condition d'environnement déplacerait la dépendance non prouvée ; forcer un 404 sur le handler sans condition recréerait le risque. Un second handler/fichier ou une configuration vhost LiteSpeed pourrait préserver un 404 direct, mais ajoute duplication ou dépendance à l'hébergement et exige sa propre recette. Renvoyer les inconnus vers l'accueil ou rediriger vers une URL d'erreur externe perdrait le contrat SEO. Aucune migration SSR, serveur applicatif ou changement d'hébergement nécessaire.

## Tests et résultats locaux

Node 24.19.0, npm 11.17.0, Chrome Headless 156, Apache portable 2.4.69 Windows, lié uniquement à 127.0.0.1:4400–4402. Installation reproductible du lockfile, aucune dépendance modifiée. Les preuves nouvelles sont dans `tmp/seo-404-fix`, hors Git.

- `npm run typecheck` : application et types des tests compilés.
- `npm run test:ci` : **48/48 succès** ; le warning Karma préexistant `404: /768w` ne constitue pas un échec.
- `npm run build` : compilation de production, 13 en-têtes, robots, sitemap et capture du document 404 réussis. Aucun changement du code Angular, du CSS ou des générateurs.
- Matrice Apache : **383 requêtes**, dont **166 ressources identiques octet par octet** au build. Métadonnées des 13 routes, GET/HEAD HTTP et HTTPS, 15 chemins d'erreur (profondeur, query, encodage, casse du préfixe interne, assets manquants), corps 404 identique, no-store, absence de Location/canonical, handler direct 200 répété et en-tête robots contrôlés.
- Injection locale de `REDIRECT_STATUS=0`, `200`, `404`, avec en-tête de contrôle pour prouver que l'injection a été appliquée au handler direct ; les erreurs conservent leur statut/corps, le handler reste 200. Cette simulation ne reproduit pas les phases internes de LiteSpeed et ne prouve pas l'origine du 500.
- Chaînes de redirection bornées, détection de répétition, HTTP/HTTPS × apex/www, slash/index, query encodée préservée, pas de rétrogradation TLS. Simulation supplémentaire d'un frontal HTTP→HTTPS avant `.htaccess`, avec étape www éventuelle. Tous les Location sont remappés vers les listeners locaux : la recette ne suit jamais une redirection vers la production. `X-Forwarded-Proto` forgé ne contourne pas TLS et ne crée pas de boucle sur un TLS réel.
- Navigateur : les 13 pages et leurs métadonnées en 200 ; 404 réelle à un chemin imbriqué, puis retour accueil. Comparaison avec Contact à 1440×1000 et 375×1000, avec et sans JavaScript : dimensions et styles relevés du header/footer identiques ; menu mobile et Échap, CTA accueil, absence de débordement de la 404. Captures conservées. Débordement Contact mobile préexistant encore observé. Services tiers bloqués pendant cette recette ; Maps non revalidé. Aucune exception applicative observée pendant le parcours des 13 pages.
- Audits npm : **0 alerte de production**, **8 modérées d'outillage**, aucune élevée/critique. Dépendances et lockfile inchangés, aucun audit fix.

Le fichier généré `public/404.html` peut différer en fins de ligne sous Windows. La capture fraîche et sa copie du build restent dans les preuves ; le snapshot versionné identique après normalisation est préservé afin de ne pas ajouter un diff de génération sans rapport au correctif.

La CI existante appelle déjà `scripts/check-http-seo.sh` après le build sur Ubuntu 24.04. Le script utilise désormais un troisième listener et `mod_setenvif` pour les seules fixtures ; aucune modification du workflow ni publication automatisée. Syntaxes Bash et Python vérifiées localement. **Les résultats réels Ubuntu doivent être contrôlés dans les Checks de la PR corrective sur son dernier SHA** : installation reproductible, compilations, 48 tests, build, matrice Apache et deux audits. Les succès Windows ci-dessus ne les remplacent pas ; un succès Ubuntu ne prouve pas non plus la compatibilité LiteSpeed. Les ports 4390–4392 sont locaux et non privilégiés ; le certificat et sa clé restent temporaires hors artefact.

## Vérification Hostinger future, ciblée et réversible

**P1 avant toute nouvelle livraison : autorisation distincte et recette du moteur cible.** Rien de cette procédure n'a été exécuté ici. Le GO local ne lève pas le NO-GO de livraison LiteSpeed.

1. Confirmer l'unique destination `ochevalradiant.com/public_html`, la v1.1.0 encore active et l'état de la quarantaine. Refaire un inventaire et une sauvegarde complète des fichiers réellement publiés, y compris téléchargement brut du `.htaccess`, empreintes SHA-256 et vérification ZIP/CRC/chemins. Comparer à l'ancienne sauvegarde sans l'écraser : elle ne remplace pas un état récent. Conserver tous les bundles pour les sessions déjà ouvertes. Aucun autre site ni DNS concerné.
2. Relever en lecture seule les redirections hPanel, Force HTTPS, état cache/CDN et certificat des deux noms ; capturer les quatre origines avec un client vierge, chaînes bornées. Au dernier relevé : Force HTTPS actif, cache/CDN désactivés, aucune redirection hPanel explicite ; ce sont des observations historiques, à recontrôler. Demander au support les logs autour de 16:57:26 UTC et le comportement ErrorDocument/REDIRECT_STATUS si le diagnostic exact est nécessaire. Ne pas exposer de phpinfo, variables sensibles ou journal public.
3. Si autorisé, effectuer d'abord une **sonde temporaire du seul site**, dans un répertoire au nom imprévisible, sans changer le routage racine. Petit `.htaccess` propre à ce répertoire : `Options -MultiViews -Indexes`, `ErrorDocument 404 /<sonde>/404.html`, `RewriteEngine On`, `RewriteRule ^404\.html$ - [END]`, puis `RewriteRule ^declencheur\.txt$ - [R=404,END]`. Créer le fichier physique inoffensif `declencheur.txt` pour que l'ancien fallback racine fondé sur l'existence des fichiers ne l'intercepte pas. Le HTML statique minimal est noindex, follow ; appliquer no-store et X-Robots-Tag noindex à toute la sonde, sans secret ni dépendance. Vérifier GET/HEAD du document direct (200) et du déclencheur (404, corps HTML exact), sans Location ni 500, à répétition sur HTTPS apex. Une absence physique dans ce sous-dossier peut encore être absorbée par le fallback racine v1.1.0 et répondre 200 : ne pas prendre cela pour un test de la nouvelle règle racine. Si l'héritage empêche aussi le déclencheur d'atteindre la configuration enfant, déclarer la sonde non concluante plutôt que modifier la racine sans autorisation. Sauvegarder réponses/hashes, puis retirer seulement la sonde autorisée. Ce test vérifie le mécanisme d'erreur sur le moteur réel ; il ne certifie ni le 404 natif racine ni les redirections. Si la création d'une sonde n'est pas autorisée, ne pas la faire et garder cette incertitude explicite.
4. Nouvelle livraison manuelle seulement après autorisation : reconstruire un nouvel artefact/manifeste à partir du correctif validé, **ne pas réutiliser le ZIP rejeté `37010144` comme artefact corrigé**. Vérifier l'ensemble en local et dans la CI de la PR. Publier ressources puis shells SEO/robots/sitemap/404, index et `.htaccess` corrigé en dernier. Conserver tous les anciens bundles. Ne pas déplacer ni réutiliser silencieusement les preuves ou la quarantaine précédente. Les fichiers SEO deviennent accessibles avant le basculement ; garder la fenêtre aussi brève que possible et interrompre en cas de transfert incomplet.
5. Dès le basculement, priorité à `/404.html` direct 200/noindex, URL aléatoire et sous-chemin 404, faux JS/CSS/image/police 404, accès `_seo/contact.html` 404. Contrôler GET et HEAD, HTTP et HTTPS, cache no-store, absence de Location sur l'erreur finale, corps exact du 404 après décompression. Puis les 13 routes 200 avec titres/descriptions/canonicals/lang/robots, toutes les ressources et leurs empreintes, robots et sitemap 13 URL. Contrôler les quatre origines, slash/index et queries avec une limite de quatre redirections, sans boucle ni changement inattendu d'origine. Aucun 301 vers le document d'erreur. Ne pas utiliser le navigateur seul comme preuve du statut.
6. Recette vierge desktop/mobile : navigation directe et CSR, retour/historique, menu, galeries/Échap, Contact/Maps, 404 et retour accueil avec/sans JavaScript. Comparer console, erreurs réseau et rendu à la référence v1.1.0 et aux anomalies connues ; les 404 attendues ne sont pas des exceptions applicatives. Capturer heures, réponses brutes, chaînes et empreintes avec le SHA de l'artefact.

**Retour arrière immédiat** si 500/5xx, boucle, 404 inconnu rendu en 200, route connue non 200, métadonnée d'une autre page, bundle absent/altéré, document d'erreur non fonctionnel ou régression bloquante de navigation. Restaurer d'abord le `.htaccess` original brut pour rétablir le routage v1.1.0, puis index et tout fichier ancien écrasé, depuis la sauvegarde réelle vérifiée (jamais reconstruire un bundle historique). Retirer de l'espace public les seuls contrôles SEO nouvellement ajoutés via une quarantaine ciblée hors `public_html`, **avec autorisation explicite de création/déplacement** comme lors du retour arrière précédent. Ne rien supprimer et ne pas toucher à l'ancienne quarantaine ni aux bundles. Vérifier les SHA des 219 fichiers de la référence si l'état initial est identique, sinon de l'inventaire frais ; 13 pages, ressources, sessions anciennes et nouvelles, statut de l'ancien fallback et état hPanel. La v1.1.0 rétablit ses faux 200 connus ; ce n'est pas une validation SEO. Ne pas publier tag/Release avant un bilan de production accepté.

## Risques résiduels

- **P1 — Compatibilité LiteSpeed non prouvée :** ErrorDocument local, `[END]`, statut d'erreur, en-têtes et TLS vu par le moteur restent à recetter sur le vrai vhost. La simplification retire un cycle possible ; elle ne garantit pas qu'aucune autre cause du 500 n'existe. Ne pas ajouter de règle spécifique LiteSpeed spéculative.
- **P1 — Frontal HTTPS/hPanel :** conflit de cible ou terminaison TLS mal reflétée peut boucler ; une redirection concordante ajoute des sauts. Le troisième listener Apache ne simule qu'une topologie particulière, pas la configuration du fournisseur. Ne pas faire confiance à un X-Forwarded-Proto client pour masquer un problème de frontal.
- **P2 — Contrat du handler :** `/404.html` direct 200/noindex est volontaire et testé ; surveiller que la page ne soit pas liée publiquement/indexée. Sans le fichier 404 ou avec un transfert partiel, le serveur peut rendre son erreur native ; la complétude de l'artefact est un prérequis.
- **P2 — Différences d'environnement :** Windows n'impose pas la casse Linux ; contrôler Ubuntu réel dans la CI, puis Hostinger lors d'une recette autorisée. Les snapshots HTML ne sont pas garantis identiques entre versions de Chrome/OS. Aucun rendu visuel nouveau n'est introduit par les règles.
- Les anomalies antérieures de Contact mobile, Maps/RGPD et les huit alertes modérées d'outillage restent hors correctif. Pas de nouvelle dépendance, migration ou changement d'architecture CSR.

Références primaires : [Apache, documents d'erreur et REDIRECT_STATUS](https://httpd.apache.org/docs/2.4/custom-error.html), [Apache, R non-3xx et END](https://httpd.apache.org/docs/2.4/rewrite/flags.html), [LiteSpeed, pages d'erreur personnalisées](https://www.litespeedtech.com/docs/webserver/config/vhostgeneral/#errPage), [LiteSpeed, différences du drapeau L](https://docs.litespeedtech.com/lsws/cp/cpanel/switch-apache/#rewrite-rule-l-flag).
