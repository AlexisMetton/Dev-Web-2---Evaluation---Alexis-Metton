# Quelques éléments non exhaustifs sur le projet

## Compréhension de l'énoncé
Nous devions récupérer le backend de notre ancien projeet pour le transformer en API Rest et réaliser le frontend en ReactJS.

On devait réaliser : 
- Système de routing
- Utilisation des contextes pour gérer le thèmes et l'identification
- Sécurisation des formulaires avec `react-hook-form`
- L'authentification (inscription, connexion et déconnexion)
- Ajout, modification et suppression de tâche
- Tri des tâches selon date et complétion
- Partie admin avec trois rôles (user, admin et superAdmin)
- Les Superadmin on tous les droits et les Admin peuvent simplement modifier les utilisateurs et les tâches des utilisateurs qui ne sont ni admin ni superadmin
- Dans l'administration, nous pouvons ajouter, modifier et supprimer des utilisateurs et les tâches qui leur sont liées. Sachant que seuls les Superadmin peuvent attribuer des rôles admin ou superadmin

## Partie Backend

J'ai dû modifier mon backend afin qu'il corresponde et réponde à mes  besoins. Pour commencer, j'ai supprimer mes tests cypress puisque ce sera sur mon frontend que je vais l'utiliser pour les tests. Ensuite, j'ai modifier le rendu de tous mes controllers afin qu'ils renvoient des réponses JSON plutôt que des `render` (car je travaillais en ejs pour l'ancien projet).

Concernant les ajouts, j'ai dû ajouter des routes en admin afin d'assurer la totalité des actions. Sachant qu'il y avait aussi des restrictions selon le grade de l'administrateur j'ai ajouter une vérification de permissions dans `permissions.js` afin déviter qu'un ROLE_ADMIN puisse attribuer ou modifier des ROLE_ADMIN en tapant directement une URL de l'API. J'ai aussi dû ajouter quelques requêtes à la base de données pour satisfaire toutes les fonctionnalités de l'application.

Enfin, j'ai adapté l'ensemble de mes tests unitaires et fonctionnels afin qu'ils correspondent aux changements que j'ai effectués.

Voici les changements majeurs sur mon backend.

## Partie Frontend

J'ai créé mon projet frontend avec Vite pour de meilleure performance. Ensuite, j'ai paramétré le projet avec Tailwind et ShadCN dans le but de faciliter la mise en forme des visuels. 

J'ai essayé de créer un maximum de 'components' pour mieux hiérarchiser mon application et son évolutivité. Le routage de mon application a été fait avec `react-routeur`. L'ensemble de mes formulaires ont été sécurisés avec `react-hook-form` et les inputs ont été créés avec un `CustomInput` (idem pour les textarea).

L'authentification est géré avec un token JWT et un useContext afin de sauvegarder les données de l'utilisateur connecté (idem pour le theme light ou dark de l'application).

Mes routes sont protégées par des middlewares pour sécuriser leurs accès.

L'ensemble des fonctionnalités des tâches et de l'administration ont été réalisés.

Concernant les tests, par manque de temps je suis allé à l'essentiel. J'ai d'abord réalisé des tests unitaires avec Jest sur mes deux composants de formulaire (`UserForm` et `TaskForm`). Puis, j'ai réalisé des tests end to end avec Cypress sur l'inscription et la connexion.

Pour terminer, j'ai mis en place les GitHub actions pour que ces tests frontend et backend s'effectue à chaque changement sur ma branche `develop` et `main`.

Il s'agit d'une description non exhaustive de mon frontend mais ça permet de voir les grands axes des fonctionnalités, même s'il y en a d'autres qui ont été faites.