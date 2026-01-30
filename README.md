# One Piece Card Collection

Une application web pour gérer votre collection de cartes One Piece Card Game.

## Fonctionnalités

- **Page d'accueil** : Affiche toutes les séries disponibles
- **Détails d'une série** : Liste toutes les cartes d'une série avec filtres par statut
- **Recherche** : Recherche et filtre les cartes par nom, numéro, série, rareté et statut

## Technologies

- **Nuxt 3** - Framework Vue.js full-stack
- **Tailwind CSS v4** - Framework CSS
- **TypeScript** - Typage statique
- **PWA** - Support Progressive Web App

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser la build de production
npm run preview
```

Le site sera accessible sur http://localhost:3000

## Gestion de la collection

La collection est gérée via des fichiers JSON manuels dans le dossier `public/data/`.

### Structure des données

#### `public/data/series.json`

Liste de toutes les séries disponibles :

```json
[
  {
    "id": "op01",
    "name": "Booster Pack Romance Dawn (OP-01)",
    "image": "/images/series/op01.jpg"
  }
]
```

**Champs :**
- `id` : Identifiant unique de la série (ex: "op01", "sd01")
- `name` : Nom complet de la série
- `image` : Chemin vers l'image de la série (optionnel)

#### `public/data/rarities.json`

Liste de toutes les raretés :

```json
[
  {
    "id": "c",
    "name": "Common"
  },
  {
    "id": "sr",
    "name": "Super Rare"
  }
]
```

**Champs :**
- `id` : Identifiant court de la rareté (c, uc, r, sr, sec, etc.)
- `name` : Nom complet de la rareté

#### `public/data/cards.json`

Liste de toutes vos cartes :

```json
[
  {
    "id": "op01-001",
    "cardNumber": "OP01-001",
    "name": "Monkey D. Luffy",
    "seriesId": "op01",
    "rarityId": "sr",
    "image": "/images/cards/op01-001.jpg",
    "status": "acquired",
    "duplicates": 2
  }
]
```

**Champs :**
- `id` : Identifiant unique de la carte (même format que cardNumber en minuscules)
- `cardNumber` : Numéro officiel de la carte (ex: "OP01-001")
- `name` : Nom de la carte
- `seriesId` : Référence vers l'ID de la série
- `rarityId` : Référence vers l'ID de la rareté
- `image` : Chemin vers l'image de la carte (optionnel)
- `status` : Statut de la carte
  - `"acquired"` : Carte possédée
  - `"wanted"` : Carte recherchée
  - `"both"` : Les deux (possédée et recherchée pour échange)
- `duplicates` : Nombre de doublons (0 si aucun)

### Ajouter des éléments

#### Ajouter une série

1. Ajoutez l'image de la série dans `public/images/series/` (ex: `op01.jpg`)
2. Ajoutez une entrée dans `public/data/series.json` :

```json
{
  "id": "op02",
  "name": "Booster Pack Paramount War (OP-02)",
  "image": "/images/series/op02.jpg"
}
```

#### Ajouter une carte

1. Ajoutez l'image de la carte dans `public/images/cards/` (ex: `op01-025.jpg`)
2. Ajoutez une entrée dans `public/data/cards.json` :

```json
{
  "id": "op01-025",
  "cardNumber": "OP01-025",
  "name": "Roronoa Zoro",
  "seriesId": "op01",
  "rarityId": "r",
  "image": "/images/cards/op01-025.jpg",
  "status": "wanted",
  "duplicates": 0
}
```

#### Modifier le statut d'une carte

Éditez directement le fichier `public/data/cards.json` et changez la valeur du champ `status` :

```json
{
  "id": "op01-025",
  "status": "acquired",  // Changé de "wanted" à "acquired"
  "duplicates": 1        // Ajout d'un doublon
}
```

### Images

Les images doivent être placées dans les dossiers appropriés :

- **Séries** : `public/images/series/`
- **Cartes** : `public/images/cards/`

**Formats recommandés :**
- Séries : Format paysage (16:9), ~800x450px
- Cartes : Format portrait (3:4), ~300x400px
- Formats supportés : JPG, PNG, WEBP

## Déploiement

Le projet peut être déployé sur n'importe quelle plateforme supportant Nuxt 3 :

- Vercel
- Netlify
- Cloudflare Pages
- Ou votre propre serveur

```bash
# Générer le site statique
npm run generate

# Les fichiers seront dans .output/public
```

## Licence

Projet personnel - Libre d'utilisation
