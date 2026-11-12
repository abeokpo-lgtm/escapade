# Escapade

Mini-site web statique (HTML, CSS, JavaScript natifs) pour préparer une petite sortie : on choisit un budget, une durée et une catégorie, on compose un programme et on coche une checklist. Tout est sauvegardé dans le navigateur (`localStorage`). Aucun serveur, compte, clé API ou service payant.

> **Contenu fictif :** la ville « Port-Lumière », les activités, les prix et les durées sont des exemples à remplacer ou à vérifier avant tout usage réel.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Structure de la page |
| `styles.css` | Mise en page, couleurs, mode sombre |
| `data.js` | Données d’exemple (ville, activités, checklist) |
| `app.js` | Filtres, programme, checklist, sauvegarde |

## Lancer en local

1. Téléchargez ou clonez le dépôt.
2. Double-cliquez sur `index.html` : le site s’ouvre dans votre navigateur. Aucune installation n’est nécessaire.

## Publier avec GitHub Pages (débutant)

1. Créez un compte sur [github.com](https://github.com) puis un nouveau dépôt **public** (par exemple `escapade`).
2. Cliquez sur **Add file → Upload files** et déposez `index.html`, `styles.css`, `data.js`, `app.js` et `README.md` (à la racine du dépôt, pas dans un sous-dossier). Validez avec **Commit changes**.
3. Ouvrez l’onglet **Settings → Pages**.
4. Dans **Build and deployment**, choisissez **Deploy from a branch**, la branche `main` et le dossier `/ (root)`, puis **Save**.
5. Attendez une ou deux minutes : l’adresse `https://VOTRE-NOM.github.io/escapade/` apparaît en haut de la page Pages.

Tous les chemins du site sont relatifs : il fonctionne à l’adresse d’un projet GitHub Pages.

## Personnaliser

- **Ville et activités :** modifiez `data.js` (`destination`, `activites`, `categories`, `checklist`). Chaque activité a un `id` unique, un titre, une catégorie, une description, une durée en minutes, un coût en euros, une couleur `motif` et une `icone` (emoji décoratif).
- **Budget maximal du curseur :** changez `max="60"` dans `index.html` (et la valeur 60 dans `app.js`, fonctions `DEFAULTS` et `load`).
- **Durées proposées :** modifiez les `<option>` du champ « Durée maximale » dans `index.html` (et la liste `[0, 60, 120, 180]` dans `app.js`).
- **Couleurs :** variables CSS au début de `styles.css`.
- **Photos :** le site n’utilise aucune image distante (motifs CSS + emojis). Pour ajouter vos photos, placez-les dans `assets/` et référencez-les avec des chemins relatifs, avec un texte alternatif.

## Choix faits

- Pas de framework ni de compilation, pour une publication directe.
- Les filtres de budget et de durée s’appliquent **par activité** (et non au programme complet) ; le programme affiche ensuite les totaux.
- Une activité déjà dans le programme y reste même si les filtres la masquent.
- « Choisir pour moi » ajoute une activité au hasard parmi celles visibles et la met en évidence.
- Le bouton d’effacement demande une confirmation, puis réinitialise critères, programme, checklist et thème.
- Les données locales invalides sont ignorées sans erreur.
