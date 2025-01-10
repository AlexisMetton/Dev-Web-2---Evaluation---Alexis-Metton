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

    describe('Admin Controller Tests', () => {
        it('should list all users', async () => {
            const mockUsers = [
                { id: 1, username: 'user1', email: 'user1@example.com', roles: ['ROLE_USER'] },
                { id: 2, username: 'admin', email: 'admin@example.com', roles: ['ROLE_ADMIN'] },
            ];

            User.getAll.mockResolvedValue(mockUsers);

            await adminController.listUsers(req, res);

            expect(User.getAll).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                users: mockUsers,
            });
        });

        it('should handle error when listing users', async () => {
            User.getAll.mockRejectedValue(new Error('Database error'));

            await adminController.listUsers(req, res);

            expect(User.getAll).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Erreur lors de la récupération des utilisateurs.',
            });
        });

        it('should delete a user by ID', async () => {
            req.params = { id: 1 };

            User.delete.mockResolvedValue();

            await adminController.deleteUser(req, res);

            expect(User.delete).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Utilisateur supprimé avec succès.',
            });
        });

        it('should handle error when deleting a non-existent user', async () => {
            req.params = { id: 999 };
            User.delete.mockRejectedValue(new Error('User not found'));

            await adminController.deleteUser(req, res);

            expect(User.delete).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Utilisateur introuvable.',
            });
        });
    });
});
