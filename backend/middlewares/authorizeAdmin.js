const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.session.token;

    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé. Veuillez vous connecter.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifiez si l'utilisateur a le rôle d'administrateur
        if (!decoded.roles || !decoded.roles.includes('ROLE_ADMIN')) {
            return res.status(403).json({ message: 'Accès refusé. Droits administrateurs requis.' });
        }

        // Injecte les informations utilisateur dans `req.user` pour les contrôleurs
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token invalide ou expiré. Veuillez vous reconnecter.' });
    }
};
