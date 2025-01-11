# **Documentation Technique : Task Manager Application**

Bienvenue dans le projet **Task Manager Application** ! Ce document fournit toutes les informations nécessaires pour permettre à un nouveau développeur de s'intégrer rapidement et de travailler efficacement sur ce projet.

---

## 1. Vue d'ensemble

### 1.1 Présentation du projet

Ce repositorty est un fork du projet suivant : [Voir le dépôt sur GitHub](https://github.com/AlexisMetton/dumb_task_manager_groupe_dg_am.git). Il s'agit d'un développement qui reccueillait énornmément de problèmes d'architecture, de sécurité, etc. Notre travail a été d'améliorer ce projet en ajoutant toutes les bonnes pratiques et fonctionnalités nécessaire afin de sécuriser et améliorer le code. vous pouvez consulter nos analyses du dépôt initial dans le dossier "Docs".

Task Manager Application est une application web permettant :

- Aux utilisateurs de gérer leurs tâches (ajouter, modifier, supprimer).
- Aux administrateurs de gérer les utilisateurs (ajout, modification et suppression des utilisateurs et de leur tâche sous réserve des rôle attribuer à chaque utilisateur).

L'architecture repose sur **Node.js**, **Express.js**, et **MySQL**, avec une gestion sécurisée des sessions et des tokens JWT pour l'authentification pour la backend.

L'architecture repose sur **ReactJS**, **Tailwind**, et **ShadCN**, pour le frontend de l'application.

---

### 1.2 Stack Technique

- **Backend** : Node.js, Express.js
- **Frontend** : ReactJS, Tailwind, ShadCN
- **Base de données** : MySQL
- **Tests** :  
  - Jest pour les tests unitaires et d'intégration
  - Cypress pour les tests E2E
- **Authentification** : Tokens JWT
- **CI/CD** : GitHub Actions

---

## 2. Architecture du Projet

### 2.1 Structure des Dossiers

``` bash
.github/workflows/
backend/
frontend/
```

---

### 2.2 Points d'Entrée de l'Application

#### Routes Principales

- **Authentification** :
  - POST `/auth/register` : Inscription
  - POST `/auth/login` : Connexion
  - GET `/auth/logout` : Déconnexion
  - GET `/auth-status` : Vérifier la connexion

- **Tâches** :
  - GET `/tasks` : Liste des tâches
  - POST `/tasks` : Création d'une tâche
  - PUT `/tasks/:id` : Modification d'une tâche
  - DELETE `/tasks/:id` : Suppression d'une tâche

- **Administration** :
  - GET `/admin` : Liste des utilisateurs
  - POST `/admin/user` : Création d'un utilisateur
  - PUT `/admin/user/:id` : Modification d'un utilisateur
  - DELETE `/admin/user/:id` : Suppression d'un utilisateur

  - GET `/admin/tasks` : Liste des tâches
  - POST `/admin/tasks` : Création d'une tâche
  - PUT `/admin/tasks/:id` : Modification d'une tâche
  - DELETE `/admin/tasks/:id` : Suppression d'une tâche

## 3. Configuration

### 3.1 Variables d'Environnement

``` bash
PORT=3001

JWT_SECRET=phrase_secret

SECRET=secret_taskmanager

HOST=localhost

USER=root

PASSWORD=root

DATABASE=task_manager_demo

DB_PORT=3306
# Si vous modifiez ce port alors modifer dans le fichier ".github/workflow/testEndToEnd.yaml" le port exposé par mysqk (le premier port).

CREATE_USER=user

CREATE_PASSWORD=UserPasswword8@ 
# Obligation de mettre un mot de passe fort avec au moins 8 caractères, un chiffre, un caractère spécial, une majuscule et une minuscule

CREATE_EMAIL=demoUser@demo.com

CREATE_ROLE=["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPERADMIN"]

INCORRECT_PASSWORD=WrongPassword8@ 
# Obligation de mettre un mot de passe fort avec au moins 8 caractères, un chiffre, un caractère spécial, une majuscule et une minuscule

INCORRECT_USER=test_wronguserdemo 
# Il est important de garder le "test_" avant l'utilisateur pour que le script de cleanup de la base de données supprime bien les ajouts de tests

INCORRECT_EMAIL=wrongemaildemo@wrongemail.com

```

### 3.2 Base de Données

- Système : MySQL
- Configuration dans `config/db.js`
- Connexion via pool de connexions
- Gestion des erreurs de connexion

## 4. Fonctionnalités Principales

### 4.1 Authentification

- Système basé sur JWT
- Middleware `authenticate.js` pour la protection des routes
- Validation des données utilisateur

### 4.2 Gestion des Tâches

- CRUD complet des tâches
- Filtrage et tri
- Attribution aux utilisateurs
- Statuts de tâches
- Gestion d'un thème `light` et `dark` sur tout le site

### 4.3 Administration

- Gestion des utilisateurs
- Supervision des tâches
- Rapports et statistiques
- Contrôle d'accès via `authorizeAdmin.js`
- Contrôle d'autorisation via `permissions.js`

## 5. Tests
### 5.1 Tests Backend
#### 5.1.1 Tests Unitaires (Jest)

- Tests des modèles :
  - `user.test.js` : Validation des données utilisateur
  - `tasks.test.js` : Validation des tâches

#### 5.1.2 Tests d'Intégration

- Tests des contrôleurs :
  - `authController.test.js`
  - `tasksController.test.js`
  - `adminController.test.js`

### 5.2 Tests Frontend
#### 5.2.1 Tests E2E (Cypress)

- Scénarios dans `login.cy.js` et `register.cy.js`
- Tests de la connexion et inscription
- Validation des interfaces

#### 5.2.2 Tests unitaires (Jest)

- Tests des components de formulaire :
  - `TaskForm.test.js` : Validation du formulaire d'ajout de task
  - `UserForm.test.js` : Validation du formulaire d'ajout d'utilisateur

## 6. Sécurité

### 6.1 Authentification

- Hachage des mots de passe
- Validation des tokens JWT
- Protection contre les injections SQL

### 6.2 Autorisation

- Système de rôles (User/Admin/Superadmin)
- Middleware de vérification des droits
- Isolation des données par utilisateur

### 6.3 Validation des Données

- Validation des entrées utilisateur
- Échappement des données sensibles
- Protection XSS

## 7. Déploiement

### 7.1 Prérequis

1. **Node.js** (version 16 ou supérieure)
2. **MySQL** (version 8 ou supérieure)
3. **npm** (installé avec Node.js)

### 7.2 Installation

1. Clonez ce dépôt :

```bash
git clone https://github.com/AlexisMetton/Dev-Web-2---Evaluation---Alexis-Metton.git
cd Dev-Web-2---Evaluation---Alexis-Metton
```

1. Cloner le repository
2. Aller dans le dossier `backend`
3. Copier `.env.example` vers `.env`
4. Configurer les variables d'environnement
5. Installer les dépendances : `npm install`
6. Démarrer le backend : `npm start`
7. Aller dans le dossier frontend
8. Installer les dépendances : `npm install`
9. Démarrer le frontend : `npm run dev`

---

## 7.3 Détails techniques

### Base de données

- **Configuration** : Définie dans `src/config/db.js`
- **Tables** :
  - **users** : Contient les données utilisateurs.
  - **tasks** : Contient les données des tâches associés à chaque utilisateur.

La base de données et les tables sont créées automatiquement au lancement du `npm run start` si elles n'existent pas au démarrage.

### Middlewares

- **Middleware `authenticate.js`** : Avant d'accéder à une page utilisateur on vérifie si l'utilisateur est bien connecté.
- **Middleware `authorizeAdmin.js`** : Avant d'accéder à l'administration, on vérifie si l'utilisateur a bien le rôle `ROLE_ADMIN`.
- **Middleware `permissions.js`** : Permet de vérifier que les modificationd des données utilisateurs admin et superadmin peuvent être réalisé seulement par un `ROLE_SUPERADMIN`.

### Sécurité

Les tokens JWT sont signés avec une clé secrète (`JWT_SECRET`) présent dans le fichier `.env`. Il a aussi une durée avant expiration de 2 heures.

### Tests des modèles et routes

Les tests couvrent toutes les fonctionnalités des :

- **Modèles** : Vérification des opérations travaillant avec la base de données (comme des requêtes d'ajout, de récupération, de modification ou de suppression).
- **Contrôleurs** : Validation des fonctionnalités et de la logique métier.
- **Middlewares** : Test pout la validation d'accès à des ressources protégées.

## 7.4 **Comment lancer des tests backend**

```bash
npm test // Permet de lancer tous les tests
```

```bash
npm test:routes // Permet de lancer les tests sur le code des controllers
```

```bash
npm test:models // Permet de lancer tous les tests sur le code des modèles
```

---

## 7.4 **Comment lancer des tests frontend**

```bash
npm test // Permet de lancer tous les tests unitaire de jest
```

```bash
npm run test:e2e // Permet de lancer les tests end to end avec Cypress
```

---

## 7.6 CI/CD avec GitHub Actions Backend

### Workflow 1 : Tests des Modèles et Routes

Ce workflow exécute les tests unitaires et fonctionnels des modèles et des routes. Il est déclenché lors de chaque push, ou pull request sur `develop` et `main.`
Vous pouvez trouver les paramètres de ce workflow dans le dossier `.github/workflows/tests.yml`

## 7.7 CI/CD avec GitHub Actions Frontend

### Workflow 1 : Tests unitaires

Ce workflow exécute les tests unitaires du frontend. Il est déclenché lors de chaque push, ou pull request sur `develop` et `main.`
Vous pouvez trouver les paramètres de ce workflow dans le dossier `.github/workflows/test_frontend.yml`

### Workflow 2 : Tests End to End

Ce workflow exécute les tests end-to-end (E2E) avec Cypress pour vérifier le bon fonctionnement global de l'application. Il est déclenché lors de chaque push, ou pull request sur `develop` et `main.`
Vous pouvez trouver les paramètres de ce workflow dans le dossier `.github/workflows/test_end_to_end_frontend.yml`

---

## 8.Ajout d'une nouvelle fonctionnalités

### 1. Créer une branche

```bash
git checkout -b feature/nom-fonctionnalite
```

### 2. Développer votre fonctionnalité et votre test

### 3. Envoyer vos modifications sur GitHub

```bash
git commit -m "Ajout de ma fonctionnalité"
git push origin feature/nom-fonctionnalite
```

---

## 9. Bonnes pratiques

- Respectez l'architecture existante.
- Ajoutez des commentaires explicatifs si nécessaire.
- Assurez-vous que tous les tests passent avant de soumettre une Pull Request.
