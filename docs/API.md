# VIBETUBE API Documentation

Toutes les réponses API suivent le format :
```json
{
  "success": true,
  "data": { ... },
  "message": "Message optionnel"
}
```

## 1. Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/login` | Connexion utilisateur | Non |
| POST | `/register` | Inscription nouvel utilisateur | Non |
| POST | `/logout` | Déconnexion (clear cookies) | Oui |
| GET | `/me` | Récupérer le profil actuel | Oui |
| PUT | `/me/password` | Changer le mot de passe | Oui |
| POST | `/refresh` | Rafraîchir l'access token | Non |

## 2. Vidéos (`/api/videos`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/` | Liste des vidéos | `page`, `perPage`, `sort`, `category`, `tag`, `quality` |
| GET | `/popular` | Vidéos les plus vues | `period` (today, week, month, all) |
| GET | `/[slug]` | Détail d'une vidéo | - |
| GET | `/[slug]/related` | Vidéos similaires | - |
| POST | `/[slug]/vote` | Liker / Disliker | `voteType` (UP, DOWN) |
| POST | `/[slug]/report` | Signaler une vidéo | `reason`, `description` |

## 3. Catégories & Tags

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/categories` | Liste toutes les catégories |
| GET | `/api/categories/[slug]` | Vidéos d'une catégorie |
| GET | `/api/tags` | Liste tous les tags |
| GET | `/api/tags/popular` | Tags les plus utilisés |

## 4. Espace Utilisateurs (`/api/me`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/favorites` | Vidéos favorites de l'utilisateur |
| GET | `/history` | Historique de visionnage |
| GET | `/stats` | Statistiques personnelles |

## 5. Administration (`/api/admin`)

*Authentification ADMIN requise pour tous ces endpoints.*

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/stats` | Statistiques globales du site |
| GET | `/activity` | Logs d'activité récents |
| POST | `/sources/[id]/sync` | Lancer la synchronisation EPORNER |
| CRUD | `/videos`, `/users`, `/categories` | Gestion complète des ressources |

## Codes de Statut HTTP

- **200/201** : Succès.
- **400** : Requête invalide (validation fail).
- **401** : Non authentifié (token manquant ou expiré).
- **403** : Accès refusé (insuffisance de droits admin).
- **404** : Ressource non trouvée.
- **429** : Trop de requêtes (Rate limit).
- **500** : Erreur serveur.
