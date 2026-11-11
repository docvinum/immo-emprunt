
# Mon Budget Immo

**Simulateur gratuit de capacité d'emprunt immobilier pour une résidence principale en France.**

Mon Budget Immo permet d'estimer le montant maximal empruntable, la mensualité disponible et le prix d'acquisition envisageable à partir des revenus d'un ou de deux emprunteurs.

L'application est entièrement statique, responsive et fonctionne directement dans le navigateur.

Aucun compte, backend, service tiers ou framework n'est nécessaire.

> **Avertissement**
>
> Les résultats sont indicatifs. Ils ne constituent ni une offre de prêt, ni un accord bancaire, ni un calcul réglementaire du TAEG.

## 1. Fonctionnalités

### Revenus des emprunteurs

- Salaire brut annuel du premier emprunteur.
- Curseur et champ numérique synchronisés.
- Statut cadre ou non-cadre.
- Estimation automatique du salaire net mensuel avant impôt.
- Possibilité de remplacer cette estimation par le revenu net mensuel réel.
- Activation facultative d'un co-emprunteur.
- Revenus et statut indépendants pour chaque emprunteur.
- Conservation des valeurs du co-emprunteur lors de sa désactivation.

### Paramètres du crédit

- Durées de 15, 20 ou 25 ans.
- Taux nominal annuel modifiable.
- Assurance emprunteur globale ou individuelle.
- Quotités d'assurance personnalisables.
- Taux d'endettement maximal de 33 % ou 35 %.
- Déduction des mensualités de crédits existants.
- Recalcul instantané des résultats.

### Budget immobilier

- Apport personnel.
- Acquisition dans l'ancien ou le neuf.
- Frais d'acquisition personnalisables.
- Estimation du prix maximal du bien, hors frais.

### Résultats

Le simulateur affiche :

- Revenus nets mensuels du foyer.
- Capacité d'endettement mensuelle.
- Mensualités de crédits existants.
- Mensualité disponible pour le nouveau prêt.
- Capital maximal empruntable.
- Mensualité hors assurance.
- Assurance mensuelle.
- Intérêts totaux.
- Coût total de l'assurance.
- Coût total du crédit.
- Montant total remboursé.
- Budget global d'acquisition.
- Frais d'acquisition estimés.
- Prix maximal du bien immobilier.

### Autres fonctionnalités

- Interface responsive.
- Paramètres avancés repliables.
- Messages d'avertissement.
- Réinitialisation des paramètres.
- Partage d'une simulation par URL.
- Navigation clavier et prise en compte de la réduction des animations.
- Mise en page adaptée à l'impression.

## 2. Technologies

Le projet utilise exclusivement :

| Technologie | Utilisation |
|---|---|
| HTML5 | Structure sémantique |
| CSS3 | Design responsive |
| JavaScript ES2020+ | Calculs et interactions |
| URLSearchParams | Partage des simulations |
| Intl.NumberFormat | Formatage monétaire français |
| GitHub Pages | Hébergement statique |

Aucune dépendance npm n'est requise.

Aucune compilation n'est nécessaire.

## 3. Structure du projet

```text
mon-budget-immo/
├── index.html
├── style.css
├── app.js
└── README.md
```

### `index.html`

Contient la structure de la page, les formulaires, les cartes de résultats et les informations méthodologiques.

### `style.css`

Contient les styles, les variables graphiques, les contrôles, les mises en page responsive et les règles d'impression.

### `app.js`

Contient :

- Les paramètres initiaux.
- Les fonctions de calcul financier.
- La gestion des revenus.
- Le calcul de l'assurance.
- La synchronisation des contrôles.
- La validation et la normalisation des valeurs.
- Le rendu des résultats.
- La lecture et la création des URL partageables.
- La réinitialisation.

### `README.md`

Documentation du projet, des hypothèses et du déploiement.

## 4. Installation locale

### Prérequis

Un navigateur moderne suffit :

- Chrome
- Firefox
- Safari
- Edge

Aucune installation de Node.js n'est nécessaire pour utiliser le simulateur.

### Méthode simple

Télécharger ou cloner le dépôt, puis ouvrir :

`index.html`

Le simulateur fonctionne sans connexion à Internet.

Certaines fonctions, notamment la copie automatique du lien de partage, peuvent être limitées lorsque la page est ouverte avec le protocole `file://`.

### Méthode recommandée : serveur HTTP local

Depuis le dossier du projet :

```bash
python3 -m http.server 8000
```

Ouvrir ensuite :

http://localhost:8000

Pour arrêter le serveur :

`Ctrl + C`

Cette méthode reproduit plus fidèlement le fonctionnement du site une fois publié.

## 5. Paramètres initiaux

| Paramètre | Valeur |
|---|---:|
| Salaire brut annuel principal | 75 000 € |
| Salaire brut annuel co-emprunteur | 50 000 € |
| Co-emprunteur | Activé |
| Statut des emprunteurs | Cadre |
| Durée du prêt | 20 ans |
| Taux nominal | 3,62 % |
| Assurance globale | 0,20 % |
| Endettement maximal | 35 % |
| Crédits existants | 0 €/mois |
| Apport personnel | 50 000 € |
| Type de bien | Ancien |
| Frais d'acquisition | 8 % |

### Taux nominaux proposés

| Durée | Taux initial |
|---|---:|
| 15 ans | 3,43 % |
| 20 ans | 3,62 % |
| 25 ans | 3,77 % |

Ces taux sont des **hypothèses de simulation**, pas des taux de marché actualisés.

Ils peuvent être modifiés dans l'interface.

Dans la version actuelle, changer la durée rétablit le taux initial correspondant, même si l'utilisateur avait auparavant personnalisé le taux.

## 6. Méthodologie financière

### 6.1 Conversion du brut au net

Par défaut, le simulateur utilise les coefficients indicatifs suivants :

| Statut | Coefficient |
|---|---:|
| Cadre | 76 % |
| Non-cadre | 78 % |

Formule :

```text
Net mensuel estimé =
Salaire brut annuel × coefficient / 12
```

Exemple pour un cadre rémunéré 75 000 € brut/an :

```text
75 000 × 0,76 / 12 = 4 750 €/mois
```

Il s'agit d'une approximation du net avant impôt sur le revenu.

Le résultat réel dépend notamment des cotisations, de la mutuelle, du statut professionnel et de la composition de la rémunération.

Pour améliorer la précision, l'utilisateur peut renseigner directement son revenu net mensuel réel.

### 6.2 Revenus du foyer

Pour un emprunteur seul :

```text
Revenu net du foyer = Net emprunteur 1
```

Pour deux emprunteurs :

```text
Revenu net du foyer =
Net emprunteur 1 + Net emprunteur 2
```

Les revenus du co-emprunteur ne sont pris en compte que lorsque celui-ci est activé.

### 6.3 Capacité d'endettement

Le simulateur propose deux seuils :

- 33 % : hypothèse prudente.
- 35 % : plafond de référence généralement applicable, assurance comprise, sous réserve des règles et dérogations encadrées.

Formules :

```text
Capacité mensuelle totale =
Revenus nets mensuels × Taux d'endettement
```

```text
Mensualité disponible =
MAX(0, Capacité mensuelle totale - Crédits existants)
```

Les mensualités des crédits existants sont supposées se poursuivre pendant toute la durée du nouveau prêt.

### 6.4 Facteur d'amortissement

Le prêt est modélisé comme un crédit amortissable à taux fixe, remboursé par mensualités constantes.

Variables :

- `C` : capital emprunté.
- `i` : taux nominal annuel en décimal.
- `r = i / 12` : taux mensuel.
- `n` : nombre total de mensualités.
- `f` : facteur d'amortissement.

Pour un taux positif :

```text
f = r / (1 - (1 + r)^(-n))
```

Pour un taux nul :

```text
f = 1 / n
```

Le moteur utilise `Math.log1p()` et `Math.expm1()` pour améliorer la précision numérique lorsque les taux sont proches de zéro.

### 6.5 Assurance emprunteur

Le simulateur suppose une assurance calculée sur le capital initial, avec un coût mensuel constant.

En mode simple, l'utilisateur renseigne directement le taux annuel global effectif d'assurance.

En mode détaillé :

```text
Taux effectif =
Taux emprunteur 1 × Quotité 1
+
Taux emprunteur 2 × Quotité 2
```

Les quotités sont converties en proportions décimales.

Exemple :

```text
Emprunteur 1 :
Taux = 0,20 %
Quotité = 100 %

Emprunteur 2 :
Taux = 0,20 %
Quotité = 100 %

Taux effectif global = 0,40 %
```

La formule de l'assurance mensuelle est :

```text
Assurance mensuelle =
Capital × Taux effectif annuel / 12
```

Les taux annuels sont convertis en décimal pour le calcul.

Ce modèle ne représente pas les assurances calculées sur le capital restant dû, dont les primes peuvent varier au cours du prêt.

### 6.6 Capital maximal empruntable

La mensualité disponible comprend le remboursement du prêt et l'assurance.

```text
Mensualité totale =
Capital × (Facteur d'amortissement + Facteur d'assurance)
```

Avec :

```text
Facteur d'assurance =
Taux effectif annuel / 12
```

Le capital maximal est donc :

```text
Capital empruntable =
Mensualité disponible
/
(Facteur d'amortissement + Facteur d'assurance)
```

Cette méthode permet de calculer directement le capital maximal sans recherche itérative.

### 6.7 Coût du crédit

```text
Mensualité hors assurance =
Capital × Facteur d'amortissement
```

```text
Intérêts totaux =
Mensualité hors assurance × Nombre de mensualités
- Capital
```

```text
Coût total de l'assurance =
Assurance mensuelle × Nombre de mensualités
```

```text
Coût total du crédit =
Intérêts totaux + Coût total de l'assurance
```

```text
Montant total remboursé =
Capital + Coût total du crédit
```

Les calculs conservent leur précision interne.

Les résultats sont arrondis à l'euro uniquement lors de l'affichage.

### 6.8 Budget d'acquisition

```text
Budget global =
Capital empruntable + Apport personnel
```

Le budget global doit couvrir le prix du bien et les frais d'acquisition.

Si les frais sont estimés en pourcentage du prix du bien :

```text
Prix maximal du bien =
Budget global / (1 + Taux de frais)
```

```text
Frais d'acquisition =
Prix maximal du bien × Taux de frais
```

Par défaut :

- Ancien : 8 %.
- Neuf : 3 %.

Ces pourcentages sont des estimations modifiables.

## 7. Exemple de simulation

Hypothèses :

| Paramètre | Valeur |
|---|---:|
| Salaire brut emprunteur 1 | 75 000 €/an |
| Salaire brut emprunteur 2 | 50 000 €/an |
| Statut | Cadres |
| Conversion brut/net | 76 % |
| Endettement | 35 % |
| Durée | 20 ans |
| Taux nominal | 3,62 % |
| Assurance globale | 0,20 % |
| Crédits existants | 0 € |
| Apport | 50 000 € |
| Frais d'acquisition | 8 % |

Calcul des revenus :

```text
75 000 × 0,76 / 12 = 4 750,00 €

50 000 × 0,76 / 12 = 3 166,67 €

Total = 7 916,67 €/mois
```

Mensualité maximale :

```text
7 916,67 × 35 % = 2 770,83 €/mois
```

Ordres de grandeur attendus :

| Indicateur | Résultat approximatif |
|---|---:|
| Revenus nets mensuels | 7 917 € |
| Mensualité disponible | 2 771 € |
| Capital empruntable | 460 000 € |
| Budget global | 510 000 € |
| Prix maximal hors frais | 472 000 € |

Les valeurs affichées peuvent légèrement différer de ces ordres de grandeur en raison des arrondis.

## 8. Partage des simulations

Le bouton **Copier le lien de simulation** génère une URL contenant les paramètres courants.

Exemple :

```text
https://utilisateur.github.io/mon-budget-immo/?salary1=75000&salary2=50000&co=1&years=20&rate=3.62&apport=50000
```

Cet exemple est illustratif et n'est pas une adresse de site existante.

### Fonctionnement

1. L'utilisateur ajuste les paramètres.
2. Il clique sur le bouton de partage.
3. Le simulateur génère une URL.
4. Le lien est copié dans le presse-papiers lorsque le navigateur le permet.
5. À l'ouverture du lien, les paramètres sont restaurés.

Les paramètres invalides sont ignorés ou limités aux bornes définies dans le code.

Les paramètres absents utilisent les valeurs initiales.

### Confidentialité des liens

**Attention : les revenus et les paramètres financiers figurent en clair dans l'URL.**

Toute personne possédant le lien peut consulter ces informations.

Les URL peuvent également être présentes dans :

- L'historique du navigateur.
- Les messages contenant le lien.
- Certains journaux techniques.
- Des outils de suivi éventuellement ajoutés à l'avenir.

Éviter de partager des simulations contenant des données financières sensibles.

## 9. Sécurité et données personnelles

### Architecture

L'application est entièrement exécutée dans le navigateur.

Elle ne nécessite :

- Aucun compte utilisateur.
- Aucune authentification.
- Aucune base de données.
- Aucun cookie.
- Aucun stockage local persistant.
- Aucun service d'analyse d'audience.
- Aucun appel à une API bancaire.

### Traitement des données

Les salaires et paramètres sont utilisés pour effectuer les calculs en mémoire.

Le code fourni ne transmet pas volontairement ces valeurs à un serveur applicatif.

En revanche, les paramètres ajoutés à une URL peuvent être transmis au service d'hébergement lors de l'ouverture de cette URL.

GitHub Pages assure l'hébergement des fichiers statiques et peut disposer de journaux techniques indépendants de l'application.

### Recommandations

- Utiliser HTTPS.
- Ne pas ajouter de scripts tiers sans nécessité.
- Ne jamais intégrer de secrets dans le JavaScript.
- Vérifier les modifications avant publication.
- Éviter de partager publiquement des URL contenant des revenus réels.

## 10. Validation des saisies

Le moteur définit des bornes pour les principales valeurs numériques.

| Champ | Bornes |
|---|---|
| Salaire brut annuel | 0 à 1 000 000 € |
| Net mensuel réel | 0 à 100 000 € |
| Taux nominal | 0 à 30 % |
| Taux d'assurance individuel | 0 à 10 % |
| Quotité individuelle | 0 à 100 % |
| Crédits existants | 0 à 100 000 €/mois |
| Apport | 0 à 100 000 000 € |
| Frais d'acquisition | 0 à 30 % |

Les valeurs sont normalisées par le JavaScript.

Pendant la saisie, un champ temporairement vide ne déclenche pas immédiatement le remplacement de sa valeur par zéro.

Lorsqu'un champ perd le focus, une valeur invalide est remplacée par la dernière valeur valide ou par une valeur normalisée.

Les calculs sont réalisés avec des nombres JavaScript et ne doivent pas être utilisés pour établir une documentation contractuelle.

## 11. Tests manuels

La version actuelle ne contient pas de suite de tests automatisés.

Avant publication, réaliser les vérifications suivantes.

### Test 1 : chargement initial

Ouvrir le simulateur.

Vérifier :

- Les deux emprunteurs sont activés.
- Les revenus initiaux sont corrects.
- La durée est de 20 ans.
- Le taux est de 3,62 %.
- Le capital empruntable est positif.
- Aucun message d'erreur JavaScript n'apparaît.

### Test 2 : salaire principal

Modifier le salaire brut annuel du premier emprunteur.

Vérifier :

- Le curseur et le champ numérique sont synchronisés.
- Le revenu net estimé évolue.
- La mensualité disponible évolue.
- Le capital empruntable évolue.

### Test 3 : co-emprunteur

Désactiver le co-emprunteur.

Vérifier :

- Ses champs sont masqués.
- Ses revenus ne sont plus pris en compte.
- Le capital empruntable diminue.

Réactiver le co-emprunteur.

Vérifier que ses valeurs précédentes sont conservées.

### Test 4 : revenus nets réels

Renseigner un net mensuel réel pour le premier emprunteur.

Vérifier que ce montant remplace l'estimation brut/net.

Effacer le champ.

Vérifier que l'estimation automatique est rétablie.

### Test 5 : durée du crédit

Tester successivement 15, 20 et 25 ans.

Vérifier :

- Le taux initial correspondant est appliqué.
- La mensualité maximale reste liée aux revenus.
- Le capital empruntable évolue.
- Le coût total du crédit évolue.

### Test 6 : taux nul

Saisir un taux nominal de 0 %.

Vérifier :

- Aucun résultat `NaN` ou `Infinity` n'apparaît.
- Les intérêts totaux sont nuls.
- L'assurance continue d'être calculée si son taux est positif.

### Test 7 : assurance individuelle

Activer le mode détaillé.

Configurer :

```text
Emprunteur 1 :
Taux = 0,20 %
Quotité = 100 %

Emprunteur 2 :
Taux = 0,20 %
Quotité = 100 %
```

Vérifier :

```text
Taux global effectif = 0,40 %
```

Désactiver le co-emprunteur.

Vérifier que son assurance n'est plus prise en compte.

### Test 8 : crédits existants

Augmenter progressivement les mensualités existantes.

Vérifier que la mensualité disponible diminue.

Saisir des charges supérieures à la capacité d'endettement.

Vérifier :

- Mensualité disponible : 0 €.
- Capital empruntable : 0 €.
- Affichage d'un avertissement.

### Test 9 : apport

Augmenter l'apport personnel.

Vérifier :

- Le capital empruntable reste inchangé.
- Le budget global augmente.
- Le prix maximal du bien augmente.

### Test 10 : ancien / neuf

Passer de l'ancien au neuf.

Vérifier que le taux de frais passe de 8 % à 3 %.

Le prix maximal du bien doit augmenter, à budget global constant.

### Test 11 : partage

Modifier plusieurs paramètres.

Cliquer sur **Copier le lien de simulation**.

Ouvrir le lien dans un nouvel onglet.

Vérifier que les paramètres sont restaurés.

### Test 12 : réinitialisation

Modifier plusieurs paramètres.

Cliquer sur **Réinitialiser**.

Vérifier :

- Le retour aux valeurs initiales.
- La mise à jour de tous les résultats.
- La disparition des paramètres de l'URL.

### Test 13 : saisies invalides

Tester :

- Une valeur négative.
- Une valeur supérieure au maximum.
- Un champ vide.
- Une valeur non numérique dans l'URL.
- Une durée invalide dans l'URL.
- Un taux nul.

Vérifier que l'application reste fonctionnelle.

### Test 14 : responsive

Tester au minimum les largeurs suivantes :

- 320 px.
- 375 px.
- 430 px.
- 768 px.
- 1024 px.
- 1440 px.

Vérifier :

- Absence de défilement horizontal.
- Lisibilité des résultats.
- Accessibilité des contrôles.
- Absence de chevauchement.
- Fonctionnement des curseurs sur mobile.

### Test 15 : navigateurs

Vérifier le fonctionnement sur :

- Chrome.
- Firefox.
- Safari.
- Edge.

Contrôler la console JavaScript.

## 12. Publication sur GitHub Pages

GitHub Pages permet de publier gratuitement un site statique depuis un dépôt GitHub, selon les conditions applicables au compte et au dépôt.

### Étape 1 : créer le dépôt

Sur GitHub, créer un dépôt nommé par exemple :

`mon-budget-immo`

Ajouter les quatre fichiers à la racine :

```text
index.html
style.css
app.js
README.md
```

### Étape 2 : initialiser Git

Dans le dossier du projet :

```bash
git init
git add index.html style.css app.js README.md
git commit -m "Initial version of Mon Budget Immo"
git branch -M main
```

### Étape 3 : connecter le dépôt GitHub

Remplacer `UTILISATEUR` par le nom du compte GitHub :

```bash
git remote add origin https://github.com/UTILISATEUR/mon-budget-immo.git
git push -u origin main
```

Le dépôt distant doit avoir été créé auparavant.

### Étape 4 : activer GitHub Pages

Sur GitHub :

1. Ouvrir le dépôt.
2. Aller dans **Settings**.
3. Ouvrir **Pages**.
4. Dans **Build and deployment**, choisir **Deploy from a branch**.
5. Sélectionner la branche `main`.
6. Sélectionner le dossier `/ (root)`.
7. Enregistrer.

GitHub déploie ensuite les fichiers statiques.

### Étape 5 : accéder au site

L'adresse attendue est :

```text
https://UTILISATEUR.github.io/mon-budget-immo/
```

Remplacer `UTILISATEUR` par le compte GitHub réel.

La publication peut prendre quelques minutes.

### Étape 6 : vérifier le déploiement

Tester :

- Le chargement de la page.
- Le chargement de `style.css`.
- Le chargement de `app.js`.
- Les calculs.
- Le co-emprunteur.
- Les URL partageables.
- Le comportement sur smartphone.

Les chemins relatifs utilisés dans `index.html` permettent le déploiement dans un sous-répertoire GitHub Pages.

## 13. Mettre le site à jour

Après une modification locale :

```bash
git add .
git commit -m "Update mortgage simulator"
git push
```

GitHub Pages publiera automatiquement la nouvelle version lorsque le déploiement sera terminé.

Pour vérifier l'état de publication, consulter l'onglet **Actions** ou la section **Pages** du dépôt.

## 14. Dépannage

### Le site ne s'affiche pas

Vérifier :

- Que GitHub Pages est activé.
- Que la branche sélectionnée est correcte.
- Que `index.html` se trouve à la racine.
- Que le déploiement est terminé.

### La page s'affiche sans style

Vérifier que `style.css` est présent à la racine et que `index.html` contient :

```html
<link rel="stylesheet" href="./style.css">
```

### Les calculs ne fonctionnent pas

Vérifier que `app.js` est présent et que `index.html` contient :

```html
<script src="./app.js" defer></script>
```

Ouvrir la console JavaScript pour rechercher d'éventuelles erreurs.

### Le partage ne fonctionne pas

La copie automatique nécessite généralement un contexte sécurisé, comme HTTPS ou localhost.

Sur GitHub Pages, HTTPS est disponible.

Si le navigateur bloque l'accès au presse-papiers, l'application propose une copie manuelle du lien.

### Les résultats semblent incohérents

Vérifier notamment :

- Le net mensuel réel éventuellement renseigné.
- L'activation du co-emprunteur.
- Les crédits existants.
- Le taux d'assurance global.
- Les quotités individuelles.
- Le taux nominal.
- La durée du crédit.
- Les frais d'acquisition.

## 15. Limites du simulateur

Le simulateur repose sur un modèle volontairement simplifié.

Il ne prend pas automatiquement en compte :

- Les revenus locatifs.
- Les règles bancaires de pondération des loyers.
- Les crédits existants arrivant à échéance.
- Les prêts à taux zéro.
- Les prêts aidés.
- Les différés de remboursement.
- Les remboursements anticipés.
- Les prêts à taux variable.
- Les assurances sur capital restant dû.
- Les frais de garantie.
- Les frais de dossier.
- Les frais de courtage.
- Les frais de travaux.
- Les charges de copropriété.
- Les impôts fonciers.
- Le reste à vivre.
- Les exigences particulières des banques.
- Le calcul réglementaire du TAEG.

Le calcul suppose également que les revenus retenus sont intégralement éligibles à l'analyse bancaire.

Dans la réalité, certaines primes, rémunérations variables ou revenus non salariés peuvent être retenus partiellement ou selon des règles spécifiques.

Le seuil de 35 % n'implique pas qu'un financement sera accordé.

### Cas particulier des investissements locatifs existants

Lorsqu'un emprunteur possède déjà un bien locatif financé à crédit, il ne suffit pas nécessairement de soustraire la mensualité de son crédit immobilier.

L'établissement prêteur peut également retenir une partie des loyers dans les revenus, selon sa méthode d'analyse et les règles applicables.

La version actuelle ne modélise pas ce traitement.

## 16. Évolutions possibles

Les évolutions suivantes pourraient être envisagées :

### Priorité 1 : précision financière

- Revenus locatifs avec pondération paramétrable.
- Prise en compte des prêts existants et de leur échéance.
- Frais de garantie et de dossier.
- Assurance calculée sur capital restant dû.
- Comparaison de plusieurs durées de crédit.

### Priorité 2 : aide à la décision

- Comparaison de scénarios.
- Tableau d'amortissement.
- Simulation d'un prix de bien cible.
- Estimation de l'apport nécessaire.
- Sensibilité aux variations des taux.

### Priorité 3 : expérience utilisateur

- Export PDF de la simulation.
- Graphiques de répartition du financement.
- Impression optimisée.
- Sauvegarde locale facultative.
- Mode sombre.

Ces fonctionnalités ne font pas partie de la version initiale.

## 17. Maintenance

Le projet privilégie :

- La simplicité.
- L'absence de dépendances.
- La lisibilité du code.
- Les calculs déterministes.
- La compatibilité avec les navigateurs modernes.
- Le déploiement statique.

Avant toute évolution importante, vérifier que les formules existantes restent correctes.

Une suite de tests automatisés serait particulièrement utile avant l'ajout de scénarios financiers plus complexes.

## 18. Licence

Aucune licence open source n'est définie par défaut.

Avant une diffusion ou une réutilisation par des tiers, choisir explicitement une licence adaptée au projet.

Pour un projet destiné à être librement utilisé et modifié, la licence MIT constitue une option simple.

---

**Mon Budget Immo**

Un simulateur immobilier simple, transparent et gratuit, conçu pour aider à préparer un projet d'acquisition.
