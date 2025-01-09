const jwt = require('jsonwebtoken');

module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.session && req.session.token) {
            try {
                const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
                req.user = decoded;
                return next();
            } catch (err) {
                return res.status(401).send('Invalid or expired token.');
            }
        }
        res.redirect('/login');
    },
};
