const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    listUsers: async (req, res) => {
        try {
            const users = await User.getAll();
            res.status(200).json({
                success: true,
                users,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des utilisateurs.',
            });
        }
    },

    deleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            await User.delete(id);
            res.status(200).json({
                success: true,
                message: 'Utilisateur supprimé avec succès.',
            });
        } catch (err) {
            if (err.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    error: 'Utilisateur introuvable.',
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur lors de la suppression de l’utilisateur.',
                });
            }
        }
    },

    updateUser: async (req, res) => {
        const { id } = req.params;
        const { username, email, password, roles } = req.body;
    
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Utilisateur introuvable.',
                });
            }
    
            const updatedFields = {};
            if (username) updatedFields.username = username;
            if (email) updatedFields.email = email;
            if (roles) {
                updatedFields.roles = Array.isArray(roles)
                    ? JSON.stringify(roles)
                    : JSON.stringify(roles.split(',').map(role => role.trim()));
            }
            if (password) {
                updatedFields.password = await bcrypt.hash(password, 10);
            }
    
            const updatedUser = await User.update(id, updatedFields);
    
            res.status(200).json({
                success: true,
                message: 'Utilisateur mis à jour avec succès.',
                user: updatedUser,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la mise à jour de l’utilisateur.',
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
                    error: 'Utilisateur introuvable.',
                });
            }
            res.status(200).json({
                success: true,
                user,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération de l’utilisateur.',
            });
        }
    },
    
    createUser: async (req, res) => {
        const { username, email, password, roles } = req.body;

        try {
            const existingUser = await User.findByUsernameOrEmail(username, email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'Nom d’utilisateur ou email déjà utilisé.',
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({ username, email, password: hashedPassword, roles });

            res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès.',
                user: newUser,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la création de l’utilisateur.',
            });
        }
    },
};
