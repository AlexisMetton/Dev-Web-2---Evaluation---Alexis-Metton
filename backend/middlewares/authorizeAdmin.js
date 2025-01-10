const jwt = require('jsonwebtoken');

module.exports = (requiredRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Accès non autorisé. Veuillez vous connecter.' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Vérifie si l'utilisateur a au moins un des rôles requis
            const hasRequiredRole = decoded.roles && requiredRoles.some((role) => decoded.roles.includes(role));

            if (!hasRequiredRole) {
                return res.status(403).json({ message: 'Accès refusé. Droits insuffisants.' });
            }

            req.user = decoded;
            next();
        } catch (err) {
            return res.status(403).json({ message: 'Token invalide ou expiré. Veuillez vous reconnecter.' });
        }
    };
};
