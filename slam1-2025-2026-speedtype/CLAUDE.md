# TP SpeedType

## Introduction

Ce TP a pour objectif de faire pratiquer des étudiants de BTS SIO SLAM 1ère année sur le langage JavaScript.
Les étudiants ont déjà eu 28 heures de cours sur ce langage, et ont déjà réalisé plusieurs projets en JavaScript.
Dans ce TP, les étudiants devront créer un jeu dans lequel il devront taper une suite de mots le plus rapidement possible.

## Objectifs

- Pratiquer le langage JavaScript
- Utiliser les fonctions de base du langage
- Manipuler le DOM pour créer une interface utilisateur
- Gérer les événements pour détecter les frappes de clavier
- Utiliser des fonctions de temps pour mesurer la vitesse de frappe
- Faire appel à une API pour récupérer des suites de mots aléatoires et enregistrer les scores

## Création du TP

Pour des raisons de simplicité, l'interface graphique du jeu sera très basique et tiendra sur une seule page HTML. Le fichier index.html sera fournit aux étudiants avec une structure de base, et ils devront compléter le code JavaScript pour faire fonctionner le jeu.

Le jeu fonctionnera de la manière suivante :
1. L'utilisateur sélectionne une durée de jeu (15s, 30s, 60s ou 120s) à l'aide d'un menu déroulant.
2. Lorsque l'utilisateur clique sur le bouton "Démarrer", une suite de mots aléatoires sera affichée à l'écran.
3. L'utilisateur devra taper cette suite de mots dans un champ de saisie (textarea) le plus rapidement possible.
4. Si l'utilisateur termine le paragraphe avant la fin du temps, un nouveau paragraphe est automatiquement chargé depuis l'API et le jeu continue. Le nombre de mots corrects est cumulé entre les paragraphes.
5. Lorsque le temps imparti est écoulé, le jeu s'arrête et affiche le nombre de mots correctement tapés ainsi que la vitesse de frappe en mots par minute (WPM).
6. L'utilisateur peut ensuite enregistrer son score en entrant son nom et en cliquant sur un bouton "Enregistrer le score". Les scores seront stockés dans une base de données via une API REST.

Un bouton permettra également à l'utilisateur de voir les meilleurs scores enregistrés dans la journée, la semaine, l'année ou tous les temps. Les scores seront affichés dans une modale avec l'ensemble des scores retournés par l'API et un système de pagination.

Un autre bouton permettra à l'utilisateur d'ajouter un nouveau paragraphe via un formulaire affiché dans une modale (`<dialog>`). Le formulaire contient uniquement un champ texte pour le contenu du paragraphe (la difficulté est laissée à `null`).

### API REST

- URL de base : `https://speedtype.api.pierre-jehan.com`
- Documentation Swagger : [https://speedtype.api.pierre-jehan.com](https://speedtype.api.pierre-jehan.com)
- L'API retourne des données au format JSON-LD (utiliser le header `Accept: application/json` pour du JSON classique).
- Pas de mot de passe : l'utilisateur saisit simplement un pseudo pour enregistrer son score.
- Endpoints :
  - `GET /random-paragraph` : récupérer un paragraphe aléatoire (champs : `id`, `content`, `difficulty`)
  - `GET /paragraphs` : récupérer la liste des paragraphes (champs : `id`, `content`, `difficulty`)
  - `POST /paragraphs` : ajouter un paragraphe (corps : `{ "content": "..." }`)
  - `GET /scores` : récupérer les scores (pagination via `?page=N`, filtres : `createdAt[after]`, `createdAt[before]`, `order[wpm]`, `order[createdAt]`)
  - `POST /scores` : enregistrer un score (corps : `{ "pseudo": "...", "timeLimit": 60, "wpm": 45 }`)

### Calcul du score

- La comparaison des mots est sensible à la casse et aux accents.
- Le WPM (mots par minute) est calculé uniquement sur les mots correctement saisis.

### Retour visuel

- Lorsque l'utilisateur se trompe dans sa saisie, une bordure rouge est affichée autour de la zone de saisie (textarea).

### Instructions Claude Code

Pour la conception de ce TP, tu devras créer un fichier index.html ainsi qu'un fichier style.css. Les étudiants devront créer eux-mêmes le fichier script.js et ajouter la balise `<script>` dans le HTML.
Pendant notre échange, tu devras me poser des questions si tu as besoin de précisions sur les fonctionnalités du jeu ou sur la structure du code.
Il faudra éviter d'essayer de deviner les fonctionnalités ou la structure du code sans me poser de questions, afin de s'assurer que le code que tu écris correspond bien à mes attentes.
