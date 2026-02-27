# TP SpeedType

## Objectif

Vous allez créer un jeu de vitesse de frappe en JavaScript. Le joueur doit taper une suite de mots le plus rapidement possible dans un temps imparti. A la fin de la partie, le score (nombre de mots corrects et vitesse en WPM) est affiché et peut être enregistré via une API REST.

## Fichiers fournis

- `index.html` : la structure HTML de la page (ne pas modifier la structure)
- `style.css` : les styles de l'interface (ne pas modifier)

## A faire

Vous devez créer un fichier `script.js` et ajouter la balise `<script>` correspondante dans le fichier `index.html`.

## Fonctionnement du jeu

1. L'utilisateur sélectionne une durée de jeu (15s, 30s, 60s ou 120s) dans le menu déroulant `#duration`.
2. Il clique sur le bouton **Démarrer** (`#btn-start`).
3. Une suite de mots récupérée depuis l'API s'affiche dans la zone `#words-display`.
4. La zone de saisie `#text-input` est activée et le chronomètre `#time-left` démarre.
5. L'utilisateur tape les mots dans le textarea.
6. Si l'utilisateur termine le paragraphe avant la fin du temps, un nouveau paragraphe est automatiquement chargé depuis l'API et la zone de saisie est vidée. Le nombre de mots corrects est cumulé entre les paragraphes.
7. Lorsque le temps est écoulé, la zone de saisie est désactivée et les résultats s'affichent dans la section `#results` :
   - Nombre de mots correctement tapés (`#correct-words`)
   - Vitesse en mots par minute (`#wpm`)
8. L'utilisateur peut saisir un pseudo (`#pseudo`) et cliquer sur **Enregistrer le score** (`#btn-save`) pour sauvegarder son score via l'API.

## Calcul du score

- La comparaison des mots est **sensible à la casse et aux accents**.
- Le WPM est calculé uniquement sur les **mots correctement saisis** : `WPM = (mots corrects / durée en secondes) * 60`.

## Eléments HTML utiles

| Sélecteur | Type | Description |
|---|---|---|
| `#duration` | `<select>` | Menu déroulant de sélection de la durée (valeurs : 15, 30, 60, 120) |
| `#btn-start` | `<button>` | Bouton pour démarrer la partie |
| `#time-left` | `<span>` | Affichage du temps restant (en secondes) |
| `#words-display` | `<div>` | Zone d'affichage des mots à taper |
| `#text-input` | `<textarea>` | Zone de saisie du joueur (désactivée par défaut via l'attribut `disabled`) |
| `#results` | `<div>` | Section des résultats (masquée par défaut avec la classe `hidden`) |
| `#correct-words` | `<span>` | Nombre de mots corrects |
| `#wpm` | `<span>` | Vitesse en mots par minute |
| `#pseudo` | `<input>` | Champ de saisie du pseudo |
| `#btn-save` | `<button>` | Bouton d'enregistrement du score |
| `#btn-scores` | `<button>` | Bouton pour ouvrir la modale des meilleurs scores |
| `#btn-add-paragraph` | `<button>` | Bouton pour ouvrir la modale d'ajout de paragraphe |
| `#modal-paragraph` | `<dialog>` | Modale d'ajout de paragraphe |
| `#modal-paragraph-close` | `<span>` | Bouton de fermeture de la modale paragraphe (croix) |
| `#form-paragraph` | `<form>` | Formulaire d'ajout de paragraphe |
| `#paragraph-content` | `<textarea>` | Champ de saisie du contenu du paragraphe |
| `#btn-submit-paragraph` | `<button>` | Bouton de soumission du formulaire |
| `#modal-scores` | `<dialog>` | Modale des meilleurs scores |
| `#modal-close` | `<span>` | Bouton de fermeture de la modale (croix) |
| `#scores-period` | `<select>` | Filtre par période (valeurs : `day`, `week`, `year`, `all`) |
| `#scores-body` | `<tbody>` | Corps du tableau des scores (à remplir dynamiquement) |
| `#btn-prev` | `<button>` | Bouton page précédente |
| `#btn-next` | `<button>` | Bouton page suivante |
| `#page-info` | `<span>` | Indicateur de page courante |

## Classes CSS disponibles

| Classe | Cible | Effet |
|---|---|---|
| `hidden` | Tout élément | Masque l'élément (`display: none`) |
| `error` | `#text-input` | Affiche une bordure rouge autour de la zone de saisie |

## Gestion des modales (`<dialog>`)

Les modales (scores et ajout de paragraphe) utilisent la balise HTML `<dialog>`. Vous pouvez consulter la documentation MDN pour plus d'informations :
- [MDN - `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)

### Fermeture des modales

Chaque modale doit pouvoir être fermée de deux manières :

1. **En cliquant sur la croix** (`#modal-close` / `#modal-paragraph-close`).
2. **En cliquant sur le backdrop** (zone sombre autour de la modale) : la balise `<dialog>` ne gère pas cela nativement.

## API REST

L'URL de base de l'API est : `https://speedtype.api.pierre-jehan.com`

La documentation Swagger est disponible ici : [https://speedtype.api.pierre-jehan.com](https://speedtype.api.pierre-jehan.com)

L'API retourne des données au format **JSON-LD**. Pour recevoir du **JSON classique**, ajoutez le header `Accept: application/json` à vos requêtes.

### Récupérer un paragraphe aléatoire

```
GET /random-paragraph
```

Réponse (avec `Accept: application/json`) :

```json
{
    "id": 5,
    "content": "Voluptatem ut praesentium sed nostrum excepturi qui dolorem...",
    "difficulty": 3.6
}
```

Chaque paragraphe contient :
- `id` : identifiant unique
- `content` : le texte à taper
- `difficulty` : niveau de difficulté

C'est cet endpoint qu'il faut utiliser pour charger un paragraphe au démarrage du jeu et lors du chargement d'un nouveau paragraphe en cours de partie.

### Récupérer tous les paragraphes

```
GET /paragraphs
```

Réponse (avec `Accept: application/json`) :

```json
{
    "totalItems": 5,
    "member": [
        {
            "id": 1,
            "content": "Dolore qui earum vitae aspernatur...",
            "difficulty": 1.6
        }
    ]
}
```

### Ajouter un paragraphe

```
POST /paragraphs
Content-Type: application/json
```

Corps de la requête :

```json
{
    "content": "Le texte du paragraphe à ajouter."
}
```

- `content` : le texte du paragraphe (obligatoire)

### Enregistrer un score

```
POST /scores
Content-Type: application/json
```

Corps de la requête :

```json
{
    "pseudo": "MonPseudo",
    "timeLimit": 60,
    "wpm": 45
}
```

- `pseudo` : le pseudo du joueur
- `timeLimit` : la durée de la partie en secondes (15, 30, 60 ou 120)
- `wpm` : la vitesse de frappe en mots par minute

### Récupérer les scores

```
GET /scores
```

Réponse (avec `Accept: application/json`) :

```json
{
    "totalItems": 200,
    "member": [
        {
            "id": 1,
            "pseudo": "MonPseudo",
            "timeLimit": 60,
            "wpm": 45,
            "createdAt": "2025-04-11T07:55:32+00:00"
        }
    ],
    "view": {
        "first": "/scores?page=1",
        "last": "/scores?page=7",
        "next": "/scores?page=2"
    }
}
```

#### Pagination

L'API retourne 30 scores par page. Utilisez le paramètre `page` pour naviguer :

```
GET /scores?page=2
```

L'objet `view` dans la réponse contient les liens vers les pages `first`, `last`, `next` et `previous` (quand elles existent).

#### Filtres disponibles

| Paramètre | Description | Exemple |
|---|---|---|
| `createdAt[after]` | Scores créés après une date | `/scores?createdAt[after]=2025-01-01` |
| `createdAt[before]` | Scores créés avant une date | `/scores?createdAt[before]=2025-12-31` |
| `order[wpm]` | Trier par WPM (`asc` ou `desc`) | `/scores?order[wpm]=desc` |
| `order[createdAt]` | Trier par date (`asc` ou `desc`) | `/scores?order[createdAt]=desc` |

Pour le filtre par période du menu déroulant (`#scores-period`), vous devrez calculer la date correspondante en JavaScript et utiliser le paramètre `createdAt[after]`.

## Colonnes du tableau des scores

Chaque ligne du tableau (`#scores-body`) doit contenir les colonnes suivantes :

| # | Pseudo | WPM | Durée | Date |
|---|---|---|---|---|
| Rang | Pseudo du joueur | Mots par minute | Durée de la partie | Date de la partie |
