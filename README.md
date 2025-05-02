# 🍳 404.js - Plateforme de Recettes

Ce projet est une plateforme web de partage de recettes développée avec **React (Vite)**, **React Router DOM**, et **Tailwind CSS**.  
Elle propose une navigation fluide, une gestion des utilisateurs avec rôles (`user`, `admin`), et des accès restreints aux pages selon l'authentification.

## 🔐 Fonctionnalités principales

- 🔄 Navigation fluide avec React Router DOM
- 🔐 Authentification simulée (localStorage)
- 🔒 Protected Routes (routes privées accessibles uniquement après connexion)
- 🛡️ Gestion des rôles (`user` vs `admin`) pour autoriser certaines actions (ajout/suppression de recettes)
- 🎯 Guards personnalisés pour redirection selon statut
- 💻 Interface responsive avec Tailwind CSS
- 📝 Pages principales : Accueil, Recettes, Détails d'une recette, Connexion, Profil, Admin
- ⚠️ Accès sécurisé :
  - `Ajout / Modif / Suppression` → uniquement connecté
  - `Suppression` → réservé à un `admin`


## 🚀 Démarrer le projet

### 1. Cloner le projet

```bash
git clone https://github.com/ton-utilisateur/404js-recettes.git
cd 404js-recettes

### 2. Installer les dépendances
npm install

### 3. Lancer le serveur
npm run dev



