const jwt = require('jsonwebtoken');
const isAuthenticated = require('../../middlewares/authenticate');
const authorizeAdmin = require('../../middlewares/authorizeAdmin');
const User = require('../../models/user');
const adminController = require('../../controllers/adminController');

jest.mock('jsonwebtoken');
jest.mock('../../models/user');

describe('Middleware and Controller Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            redirect: jest.fn(),
            render: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Middleware isAuthenticated', () => {
        it('should deny access if no token is provided', () => {
            isAuthenticated.isAuthenticated(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Accès non autorisé. Veuillez vous connecter.',
            });
        });

        it('should deny access if token is invalid', () => {
            req.headers.authorization = 'Bearer invalidToken';
            jwt.verify.mockImplementation(() => {
                throw new Error('Token invalide');
            });

            isAuthenticated.isAuthenticated(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Token invalide ou expiré. Veuillez vous reconnecter.',
            });
        });

        it('should allow access if token is valid', () => {
            const decodedToken = { id: 1, username: 'testUser', roles: ['ROLE_USER'] };
            req.headers.authorization = 'Bearer validToken';
            jwt.verify.mockReturnValue(decodedToken);

            isAuthenticated.isAuthenticated(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
            expect(req.user).toEqual(decodedToken);
            expect(next).toHaveBeenCalled();
        });
    });
});
