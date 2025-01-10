const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validatePassword = require('../utils/passwordTestFunc');

module.exports = {
    login: async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await User.findByUsername(username);

            if (!user) {
                return res.status(400).json({ error: 'Pseudo ou mot de passe invalide.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign(
                    { id: user.id, username: user.username, roles: user.roles },
                    process.env.JWT_SECRET,
                    { expiresIn: '2h' }
                );

                return res.status(200).json({
                    message: 'Connexion réussie',
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        roles: user.roles,
                    },
                });
            } else {
                return res.status(400).json({ error: 'Pseudo ou mot de passe invalide.' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
    },
    register: async (req, res) => {
        const { username, password, email } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email invalide.' });
        }
        const responsePV = validatePassword(password)
        if (responsePV.isValid){
            passwordValide = password
        } else {
            return res.status(400).json({ error: responsePV.message });
        }

        const hashedPassword = await bcrypt.hash(passwordValide, 10);

        try {
            const existingUser = await User.findByUsernameOrEmail(username, email);

            if (existingUser) {
                return res.status(400).json({ error: 'Le nom d\'utilisateur ou l\'email existe déjà.' });
            }

            const user = await User.create({ username, password: hashedPassword, email });

            const token = jwt.sign(
                { id: user.id, username: user.username, roles: user.roles },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            return res.status(201).json({
                message: 'Inscription réussie',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    roles: user.roles || ['ROLE_USER'],
                },
            });
        } catch (err) {
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
    },
    logout: (req, res) => {
        return res.status(200).json({ message: 'Déconnexion réussie.' });
    },

    authStatus: (req, res) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Non autorisé. Aucun token fourni.' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            res.status(200).json({
                message: 'Utilisateur authentifié.',
                user: decoded,
            });
        } catch (err) {
            res.status(401).json({ message: 'Token invalide ou expiré.' });
        }
    },
};
