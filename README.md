# **Documentation Technique : Task Manager Application**

Bienvenue dans le projet **Task Manager Application** ! Ce document fournit toutes les informations nécessaires pour permettre à un nouveau développeur de s'intégrer rapidement et de travailler efficacement sur ce projet.

---

## 1. Vue d'ensemble

### 1.1 Présentation du projet

Ce repositorty est un fork du projet suivant : [Voir le dépôt sur GitHub](https://github.com/Aherbeth/dumb_task_manager). Il s'agit d'un développement qui reccueillait énornmément de problèmes d'architecture, de sécurité, etc. Notre travail a été d'améliorer ce projet en ajoutant toutes les bonnes pratiques et fonctionnalités nécessaire afin de sécuriser et améliorer le code. vous pouvez consulter nos analyses du dépôt initial dans le dossier "Docs".

Task Manager Application est une application web permettant :

- Aux utilisateurs de gérer leurs tâches (ajouter, modifier, supprimer).
- Aux administrateurs de gérer les utilisateurs (ajouter des rôles, supprimer des utilisateurs).

L'architecture repose sur **Node.js**, **Express.js**, et **MySQL**, avec une gestion sécurisée des sessions et des tokens JWT pour l'authentification.

---

### 1.2 Stack Technique

- **Backend** : Node.js, Express.js
- **Template Engine** : EJS
- **Frontend** : Tailwind
- **Base de données** : MySQL
- **Tests** :  
  - Jest pour les tests unitaires et d'intégration
  - Cypress pour les tests E2E
- **Authentification** : Sessions (Express-session) et Tokens JWT
- **CI/CD** : GitHub Actions

---

## 2. Architecture du Projet

### 2.1 Structure des Dossiers

``` bash
src/
├── app.js # Point d'entrée de l'application
├── config/
│ └── db.js # Configuration de la base de données
├── controllers/
│ ├── adminController.js # Gestion des fonctionnalités admin
│ ├── authController.js # Authentification
│ └── tasksController.js # Gestion des tâches
├── middlewares/
│ ├── authenticate.js # Vérification JWT
│ └── authorizeAdmin.js # Contrôle accès admin
├── views/
│ ├── layouts/
│ │ └── header.ejs # Template principal
│ ├── auth/
│ │ └── register.ejs # Page d'inscription
│ └── task/
│ └── tasks.ejs # Vue des tâches
├── tests/
│ ├── models/
│ │ ├── tasks.test.js
│ │ └── user.test.js
│ └── routes/
│ ├── adminController.test.js
│ ├── authController.test.js
│ └── tasksController.test.js
└── cypress/
├── e2e/
│ └── task.cy.js # Tests E2E
└── support/
└── commands.js # Commandes Cypress
```

---

### 2.2 Points d'Entrée de l'Application

#### Routes Principales

- **Authentification** :
  - POST `/auth/register` : Inscription
  - POST `/auth/login` : Connexion
  - GET `/auth/logout` : Déconnexion

- **Tâches** :
  - GET `/tasks` : Liste des tâches
  - POST `/tasks` : Création d'une tâche
  - PUT `/tasks/:id` : Modification d'une tâche
  - DELETE `/tasks/:id` : Suppression d'une tâche

- **Administration** :
  - GET `/admin/users` : Gestion des utilisateurs
  - GET `/admin/tasks` : Supervision des tâches

## 3. Configuration

### 3.1 Variables d'Environnement

``` bash
# Serveur
PORT=3001
HOST=localhost
# Base de données
DATABASE=task_manager_demo
USER=root
PASSWORD=root
DB_PORT=3306
#Sécurité
JWT_SECRET=phrase_secret
SECRET=secret_taskmanager
#Configuration des tests
CREATE_USER=user
CREATE_PASSWORD=UserPasswword8@
CREATE_EMAIL=demoUser@demo.com
CREATE_ROLE=['ROLE_USER']

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
- Gestion des sessions avec tokens
- Validation des données utilisateur

### 4.2 Gestion des Tâches

- CRUD complet des tâches
- Filtrage et tri
- Attribution aux utilisateurs
- Statuts de tâches

### 4.3 Administration

- Gestion des utilisateurs
- Supervision des tâches
- Rapports et statistiques
- Contrôle d'accès via `authorizeAdmin.js`

## 5. Tests

### 5.1 Tests Unitaires (Jest)

- Tests des modèles :
  - `user.test.js` : Validation des données utilisateur
  - `tasks.test.js` : Validation des tâches

### 5.2 Tests d'Intégration

- Tests des contrôleurs :
  - `authController.test.js`
  - `tasksController.test.js`
  - `adminController.test.js`

### 5.3 Tests E2E (Cypress)

- Scénarios dans `task.cy.js`
- Tests des flux utilisateur complets
- Validation des interfaces

## 6. Sécurité

### 6.1 Authentification

- Hachage des mots de passe
- Validation des tokens JWT
- Protection contre les injections SQL

### 6.2 Autorisation

- Système de rôles (User/Admin)
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
git clone https://github.com/AlexisMetton/dumb_task_manager_groupe_dg_am.git
cd dumb_task_manager_groupe_dg_am
```

1. Cloner le repository `git clone https://github.com/AlexisMetton/dumb_task_manager_groupe_dg_am.git && cd dumb_task_manager_groupe_dg_am`
2. Copier `.env.example` vers `.env`
3. Configurer les variables d'environnement
4. Installer les dépendances : `npm install`
5. Démarrer l'application : `npm start`

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

### Sécurité

Les sessions sont configurées avec les paramètres suivants :

- **httpOnly** : Empêche les scripts d'accéder au cookie.
- **samesite : strict** : Protège contre les attaquess CSRF.
- **maxAge** : Expiration après 2 heures.
- **secure: false** : Il faudra le mettre sur `true` si vous décidez de mettre en ligne le projet. Cela permettra que le cookie soit transmis seulement sur des connexions sécurisées (HTTPS). Puisque nous travaillons en local nous pouvons le laiser à `false`.

Les tokens JWT sont signés avec une clé secrète (`JWT_SECRET`) présent dans le fichier `.env`. Il a aussi une durée avant expiration de 2 heures.

### Tests des modèles et routes

Les tests couvrent toutes les fonctionnalités des :

- **Modèles** : Vérification des opérations travaillant avec la base de données (comme des requêtes d'ajout, de récupération, de modification ou de suppression).
- **Contrôleurs** : Validation des fonctionnalités et de la logique métier.
- **Middlewares** : Test pout la validation d'accès à des ressources protégées.

## 7.4 **Comment lancer des tests**

```bash
npm test // Permet de lancer tous les tests
```

```bash
npm test:routes // Permet de lancer les tests sur le code des controllers
```

```bash
npm test:models // Permet de lancer tous les tests sur le code des modèles
``
--- 

### Tests End to End
On exécute Cypress afin de couvrir les fonctionnalités des : 
- **Index** : Vérification des links présent sur la page.
- **Login** : Vérification des links et du formulaire de login.
- **Register** : Vérification des links et du formulaire d'inscription.
- **Tasks** : Vérification de l'existance des tâches, de leur ajout et de leur suppression.

**Comment lancer des tests**
```bash
npm run test:e2e
```

---

## 7.5 CI/CD avec GitHub Actions

### Workflow 1 : Tests des Modèles et Routes

Ce workflow exécute les tests unitaires et fonctionnels des modèles et des routes. Il est déclenché lors de chaque push, ou pull request sur `develop` et `main.`
Vous pouvez trouver les paramètres de ce workflow dans le dossier `.github/workflows/tests.yml`

### Workflow 2 : Tests End-to-End (E2E)

Ce workflow exécute des tests avec Cypress sur les pages `index.js`, `login.js`, `register.js` et `tasks.js`. Il est déclenché lors de chaque push, ou pull request sur `develop` et `main.`
Vous pouvez trouver les paramètres de ce workflow dans le dossier `.github/workflows/testsEndToEnd.yml`

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

### 4. Créer un Pull Request sur GitHub

---

## 9. Bonnes pratiques

- Respectez l'architecture existante.
- Ajoutez des commentaires explicatifs si nécessaire.
- Assurez-vous que tous les tests passent avant de soumettre une Pull Request.
