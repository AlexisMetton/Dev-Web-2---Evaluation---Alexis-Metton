# Backend Task Manager
## Prérequis

1. **Node.js** (version 16 ou supérieure)
2. **MySQL** (version 8 ou supérieure)
3. **npm** (installé avec Node.js)

## Installation

1. Clonez ce dépôt :

```bash
git clone https://github.com/AlexisMetton/dumb_task_manager_groupe_dg_am.git
cd dumb_task_manager_groupe_dg_am
```

1. Cloner le repository
2. Aller dans le dossier `backend`
3. Copier `.env.example` vers `.env`
4. Configurer les variables d'environnement
5. Installer les dépendances : `npm install`
6. Démarrer l'application : `npm start`

---

## Détails techniques

### Base de données

- **Configuration** : Définie dans `backend/config/db.js`
- **Tables** :
  - **users** : Contient les données utilisateurs.
  - **tasks** : Contient les données des tâches associés à chaque utilisateur.

La base de données et les tables sont créées automatiquement au lancement du `npm run start` si elles n'existent pas au démarrage.

## Stack Technique

- **Backend** : Node.js, Express.js
- **Base de données** : MySQL
- **Tests** :  
  - Jest pour les tests unitaires et d'intégration
- **Authentification** : Tokens JWT
- **CI/CD** : GitHub Actions

---

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



### Middlewares

- **Middleware `authenticate.js`** : Avant d'accéder à une page utilisateur on vérifie si l'utilisateur est bien connecté.
- **Middleware `authorizeAdmin.js`** : Avant d'accéder à l'administration, on vérifie si l'utilisateur a bien le rôle `ROLE_ADMIN` ou `ROLE_SUPERADMIN`.

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
```

---

## 7.5 CI/CD avec GitHub Actions

### Workflow 1 : Tests des Modèles et Routes

Ce workflow exécute les tests unitaires et fonctionnels des modèles et des routes. Il est déclenché lors de chaque push, ou pull request sur `develop` et `main.`
Vous pouvez trouver les paramètres de ce workflow dans le dossier `.github/workflows/tests.yml`

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
