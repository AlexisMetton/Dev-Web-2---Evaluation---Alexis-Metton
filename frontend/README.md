# Frontend Task Manager
## Prérequis
Assurez-vous d'avoir les outils suivants installés sur votre machine :
- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Installation
Clonez ce dépôt et installez les dépendances nécessaires :
```bash
git clone <URL_DU_REPO>
cd frontend
npm install
```

## Lancement du projet
Executer la commande suivante :
```bash
npm run dev
```
## Scripts disponibles
Démarre le serveur de développement :
```bash
npm run dev
```

Génère les fichiers de production dans le dossier `dist` :
```bash
npm run build
```

Prévisualise l'application générée après un build :
```bash
npm run preview
```

Exécute les tests end-to-end avec Cypress :
```bash
npm run test:e2e
```

Exécute les tests unitaires avec Jest :
```bash
npm run test
```

## Développement
### Ajout des composants
Les composants réutilisables doivent être ajoutés dans le dossier `src/components`

### Thèmes
Les thèmes sont gérés dans le dossier `src/layouts/themeProvider`. Utilisez le hook `useTheme` pour changer ou appliquer des styles spécifiques au thème.

## Technologies utilisées
- **Vite** : Bundler ultra rapide.
- **React** : Bibliothèque pour construire des interfaces utilisateur.
- **Tailwind** et **ShadCN** : Bibliothèques pour la mise en forme
- **Tests** :  
  - Jest pour les tests unitaire
  - Cypress pour les tests E2E
- **CI/CD** : GitHub Actions

## CI/CD avec GitHub Actions

### Workflow 1 : Tests unitaires

Ce workflow exécute les tests unitaires du frontend. Il est déclenché lors de chaque push, ou pull request sur `develop` et `main.`
Vous pouvez trouver les paramètres de ce workflow dans le dossier `.github/workflows/test_frontend.yml`

### Workflow 2 : Tests End to End

Ce workflow exécute les tests end-to-end (E2E) avec Cypress pour vérifier le bon fonctionnement global de l'application. Il est déclenché lors de chaque push, ou pull request sur `develop` et `main.`
Vous pouvez trouver les paramètres de ce workflow dans le dossier `.github/workflows/test_end_to_end_frontend.yml`

---

## Ajout d'une nouvelle fonctionnalités

### Créer une branche

```bash
git checkout -b feature/nom-fonctionnalite
```

### Développer votre fonctionnalité et votre test

### Envoyer vos modifications sur GitHub

```bash
git commit -m "Ajout de ma fonctionnalité"
git push origin feature/nom-fonctionnalite
```

---

## Bonnes pratiques

- Respectez l'architecture existante.
- Ajoutez des commentaires explicatifs si nécessaire.
- Assurez-vous que tous les tests passent avant de soumettre une Pull Request.

---

## Auteur
Ce projet a été développé par Alexis Metton.