const jwt = require('jsonwebtoken');

module.exports = {
    isAuthenticated: (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Accès non autorisé. Veuillez vous connecter.' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Injecte les données utilisateur dans `req.user`
            return next();
        } catch (err) {
            return res.status(401).json({ message: 'Token invalide ou expiré. Veuillez vous reconnecter.' });
        }
    },
};
