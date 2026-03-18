# API Test Guide

Ce guide documente comment tester manuellement les endpoints principaux du backend à l'aide de `curl`.

## 1. Authentification

### Inscription
```bash
curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "email": "test@example.com", "password": "Password123!"}'
```
- **Succès** : 201 Created. Retourne l'utilisateur et les tokens.
- **Erreur (400)** : Données invalides ou mot de passe trop simple.
- **Erreur (409)** : Email/Username déjà pris.

### Connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "Password123!"}'
```
- **Succès** : 200 OK. Retourne l'utilisateur et les tokens.
- **Erreur (401)** : Identifiants invalides.
- **Erreur (429)** : Trop de tentatives (après 5 échecs).

## 2. Vidéos et Navigation

### Liste des vidéos (Public)
```bash
curl http://localhost:3000/api/videos?page=1&perPage=24&sort=recent
```
- **Succès** : 200 OK. Liste des vidéos avec pagination.
- **Cache** : Le 2ème appel doit être beaucoup plus rapide (HIT Redis).

### Détail d'une vidéo
```bash
curl http://localhost:3000/api/videos/slug-de-la-video
```
- **Succès** : 200 OK. Détail complet.
- **Erreur (404)** : Vidéo inexistante.

### Recherche
```bash
curl http://localhost:3000/api/search?q=sexy&type=videos
```
- **Succès** : 200 OK. Résultats de recherche.

## 3. Espace Utilisateur (Token requis)

### Récupérer mon profil
```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3000/api/auth/me
```

### Ajouter un commentaire
```bash
curl -X POST http://localhost:3000/api/comments \
     -H "Authorization: Bearer <ACCESS_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"videoId": "cuid_de_la_video", "content": "Superbe vidéo !"}'
```
- **Sucess** : 201 Created.
- **Sanitization** : Si vous envoyez `<b>Test</b>`, le HTML doit être supprimé ou échappé.

## 4. Administration (Token ADMIN requis)

### Dashboard Stats
```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:3000/api/admin/stats
```

### Synchronisation Eporner
```bash
curl -X POST http://localhost:3000/api/admin/sources/<SOURCE_ID>/sync \
     -H "Authorization: Bearer <ADMIN_TOKEN>"
```

## 5. Cas d'Erreurs Communs

- **401 Unauthorized** : Envoyer une requête sans token ou avec un token expiré sur une route protégée.
- **403 Forbidden** : Utiliser un token utilisateur standard pour appeler `/api/admin/*`.
- **429 Too Many Requests** : Spam l'API login ou register.
- **400 Bad Request** : Envoyer des IDs malloformés (pas de UUID/CUID).
