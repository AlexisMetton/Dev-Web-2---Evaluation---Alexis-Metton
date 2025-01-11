const User = require("../models/user");
const Task = require("../models/task");
const { hasPermission } = require("../middlewares/permissions");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  listUsers: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Non autorisé",
        });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.id;

      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur introuvable.",
        });
      }

      const userRoles = currentUser.roles || [];
      const isSuperadmin = userRoles.includes("ROLE_SUPERADMIN");

      let users;
      if (isSuperadmin) {
        // Récupérer tous les utilisateurs pour un Superadmin
        users = await User.getAll();
      } else {
        // Récupérer uniquement les utilisateurs ayant le rôle ROLE_USER
        users = await User.getUsersByRole("ROLE_USER");
      }

      res.status(200).json({
        success: true,
        users,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des utilisateurs.",
      });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur connecté introuvable.",
        });
      }

      const targetUser = await User.findById(id);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur à supprimer introuvable.",
        });
      }

      // Vérifier les permissions
      if (!hasPermission(currentUser.roles, targetUser.roles)) {
        return res.status(403).json({
          success: false,
          error: "Vous n'avez pas l'autorisation de supprimer cet utilisateur.",
        });
      }

      await User.delete(id);
      res.status(200).json({
        success: true,
        message: "Utilisateur supprimé avec succès.",
      });
    } catch (err) {
      if (err.message === "User not found") {
        return res.status(404).json({
          success: false,
          error: "Utilisateur introuvable.",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erreur lors de la suppression de l’utilisateur.",
        });
      }
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { username, email, password, roles } = req.body;

    try {
      const token = req.headers.authorization?.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur connecté introuvable.",
        });
      }

      const targetUser = await User.findById(id);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur à modifier introuvable.",
        });
      }

      if (!hasPermission(currentUser.roles, targetUser.roles)) {
        return res.status(403).json({
          success: false,
          error: "Vous n'avez pas l'autorisation de modifier cet utilisateur.",
        });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur introuvable.",
        });
      }

      const updatedFields = {};
      if (username) updatedFields.username = username;
      if (email) updatedFields.email = email;
      if (roles) {
        updatedFields.roles = Array.isArray(roles)
          ? JSON.stringify(roles)
          : JSON.stringify(roles.split(",").map((role) => role.trim()));
      }
      if (password) {
        updatedFields.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await User.update(id, updatedFields);

      res.status(200).json({
        success: true,
        message: "Utilisateur mis à jour avec succès.",
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la mise à jour de l’utilisateur.",
      });
    }
  },

  getEditId: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur introuvable.",
        });
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération de l’utilisateur.",
      });
    }
  },

  createUser: async (req, res) => {
    const { username, email, password, roles } = req.body;

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Non autorisé. Aucun token fourni.",
        });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur connecté
      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur connecté introuvable.",
        });
      }

      const currentUserRoles = currentUser.roles || [];

      // Vérifier si l'utilisateur est uniquement ADMIN sans être SUPERADMIN
      const isOnlyAdmin =
        currentUserRoles.includes("ROLE_ADMIN") &&
        !currentUserRoles.includes("ROLE_SUPERADMIN");

      // Si l'utilisateur est uniquement ADMIN, vérifier les rôles envoyés
      if (
        isOnlyAdmin &&
        (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_SUPERADMIN"))
      ) {
        return res.status(403).json({
          success: false,
          error:
            "Les administrateurs ne peuvent pas créer d'autres administrateurs ou super-administrateurs.",
        });
      }

      const existingUser = await User.findByUsernameOrEmail(username, email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Nom d’utilisateur ou email déjà utilisé.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        roles,
      });

      res.status(201).json({
        success: true,
        message: "Utilisateur créé avec succès.",
        user: newUser,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la création de l’utilisateur.",
      });
    }
  },

  createTasks: async (req, res) => {
    const { userId } = req.params;
    const { title, description } = req.body;

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Non autorisé. Aucun token fourni.",
        });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur connecté introuvable.",
        });
      }

      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur cible introuvable.",
        });
      }

      // Vérification des permissions
      if (!hasPermission(currentUser.roles, targetUser.roles)) {
        return res.status(403).json({
          success: false,
          error:
            "Vous n'avez pas l'autorisation de créer des tâches pour cet utilisateur.",
        });
      }

      const newTask = await Task.create({ userId, title, description });

      res.status(201).json({
        success: true,
        message: "Tâche créée avec succès.",
        task: newTask,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la création de la tâche.",
      });
    }
  },

  updateTasks: async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Non autorisé. Aucun token fourni.",
        });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur connecté introuvable.",
        });
      }

      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: "Tâche introuvable.",
        });
      }

      const targetUser = await User.findById(task.userId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur cible introuvable.",
        });
      }

      if (!hasPermission(currentUser.roles, targetUser.roles)) {
        return res.status(403).json({
          success: false,
          error: "Vous n'avez pas l'autorisation de modifier cette tâche.",
        });
      }

      const updatedTask = await Task.update(id, { title, description });

      res.status(200).json({
        success: true,
        message: "Tâche mise à jour avec succès.",
        task: updatedTask,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la mise à jour de la tâche.",
      });
    }
  },

  deleteTasks: async (req, res) => {
    const { userId, taskId } = req.params;

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Non autorisé. Aucun token fourni.",
        });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur connecté introuvable.",
        });
      }

      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur cible introuvable.",
        });
      }

      const task = await Task.getTaskId(taskId);
      if (!task.task) {
        return res.status(404).json({
          success: false,
          error: "Tâche introuvable.",
        });
      }

      if (!hasPermission(currentUser.roles, targetUser.roles)) {
        return res.status(403).json({
          success: false,
          error: "Vous n'avez pas l'autorisation de supprimer cette tâche.",
        });
      }

      await Task.delete(taskId);

      res.status(200).json({
        success: true,
        message: "Tâche supprimée avec succès.",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la suppression de la tâche.",
      });
    }
  },

  getTasksUser: async (req, res) => {
    const { userId } = req.params;

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Non autorisé. Aucun token fourni.",
        });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur connecté introuvable.",
        });
      }

      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur cible introuvable.",
        });
      }

      if (!hasPermission(currentUser.roles, targetUser.roles)) {
        return res.status(403).json({
          success: false,
          error:
            "Vous n'avez pas l'autorisation d'accéder aux tâches de cet utilisateur.",
        });
      }

      const tasks = await Task.getByUserId(userId);

      res.status(200).json({
        success: true,
        tasks,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des tâches.",
      });
    }
  },
  createTasks: async (req, res) => {
    const { userId } = req.params;
    const { title, description } = req.body;

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Non autorisé. Aucun token fourni.",
        });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur connecté introuvable.",
        });
      }

      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur cible introuvable.",
        });
      }

      if (!hasPermission(currentUser.roles, targetUser.roles)) {
        return res.status(403).json({
          success: false,
          error:
            "Vous n'avez pas l'autorisation de créer une tâche pour cet utilisateur.",
        });
      }

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: "Le titre et la description de la tâche sont requis.",
        });
      }

      const newTask = await Task.create({
        title,
        description,
        completed: false,
        user_id: userId,
      });

      res.status(201).json({
        success: true,
        message: "Tâche créée avec succès.",
        task: newTask,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la création de la tâche.",
      });
    }
  },
  updateTasks: async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Non autorisé. Aucun token fourni.",
        });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur connecté introuvable.",
        });
      }

      const task = await Task.getTaskId(id);
      if (!task.task) {
        return res.status(404).json({
          success: false,
          error: "Tâche introuvable.",
        });
      }

      const targetUser = await User.findById(task.task.user_id);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur cible introuvable.",
        });
      }

      if (!hasPermission(currentUser.roles, targetUser.roles)) {
        return res.status(403).json({
          success: false,
          error: "Vous n'avez pas l'autorisation de modifier cette tâche.",
        });
      }

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error:
            "Le titre et la description sont requis pour mettre à jour la tâche.",
        });
      }

      if (
        typeof completed !== "boolean" &&
        completed !== 0 &&
        completed !== 1
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Le champ 'completed' doit être un booléen ou un entier (0 ou 1).",
        });
      }

      const completedBool = Boolean(Number(completed));

      const updatedTask = await Task.update(id, {
        title,
        description,
        completed: completedBool,
      });

      res.status(200).json({
        success: true,
        message: "Tâche mise à jour avec succès.",
        task: updatedTask,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la mise à jour de la tâche.",
      });
    }
  },
};
