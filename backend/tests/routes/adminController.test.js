const jwt = require('jsonwebtoken');
const adminMiddleware = require('../../middlewares/authorizeAdmin');
const User = require('../../models/user');
const adminController = require('../../controllers/adminController');

jest.mock('jsonwebtoken');
jest.mock('../../models/user');

describe('Admin Middleware and Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { session: {} };
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

    describe('Middleware Tests', () => {
        test('Authorization successful with valid token and ADMIN role', () => {
            const decodedToken = {
                id: 1,
                username: 'admin',
                roles: ['ROLE_ADMIN'],
            };

            req.session.token = 'validToken';
            jwt.verify.mockImplementation(() => decodedToken);

            adminMiddleware(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
            expect(req.user).toEqual(decodedToken);
            expect(next).toHaveBeenCalled();
        });

        test('Access denied without token', () => {
            adminMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Accès non autorisé. Veuillez vous connecter.',
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('Access denied with invalid token', () => {
            req.session.token = 'invalidToken';
            jwt.verify.mockImplementation(() => {
                throw new Error('Token invalide');
            });

            adminMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Token invalide ou expiré. Veuillez vous reconnecter.',
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('Access denied without ADMIN role', () => {
            const decodedToken = {
                id: 2,
                username: 'user',
                roles: ['ROLE_USER'],
            };

            req.session.token = 'validToken';
            jwt.verify.mockImplementation(() => decodedToken);

            adminMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Accès refusé. Droits administrateurs requis.',
            });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('Admin Controller Tests', () => {
        test('should list all users', async () => {
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

        test('should handle error when listing users', async () => {
            User.getAll.mockRejectedValue(new Error('Database error'));

            await adminController.listUsers(req, res);

            expect(User.getAll).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Erreur lors de la récupération des utilisateurs.',
            });
        });

        test('should delete a user by ID', async () => {
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

        test('should handle error when deleting a non-existent user', async () => {
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

        test('should update user roles successfully', async () => {
            req.params = { id: 1 };
            req.body = { roles: ['ROLE_ADMIN'] };

            const mockUser = { id: 1, roles: ['ROLE_ADMIN'] };

            User.findById.mockResolvedValue(mockUser);
            User.update.mockResolvedValue(mockUser);

            await adminController.updateUser(req, res);

            expect(User.findById).toHaveBeenCalledWith(1);
            expect(User.update).toHaveBeenCalledWith(1, { roles: JSON.stringify(['ROLE_ADMIN']) });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Rôles mis à jour avec succès.',
                user: mockUser,
            });
        });

        test('should handle error when updating roles for a non-existent user', async () => {
            req.params = { id: 999 };
            req.body = { roles: ['ROLE_ADMIN'] };

            User.findById.mockResolvedValue(null);

            await adminController.updateUser(req, res);

            expect(User.findById).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Utilisateur introuvable.',
            });
        });

        test('should fetch a user for editing by ID', async () => {
            req.params = { id: 1 };

            const mockUser = { id: 1, username: 'user1', roles: ['ROLE_USER'] };

            User.findById.mockResolvedValue(mockUser);

            await adminController.getEditId(req, res);

            expect(User.findById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                user: mockUser,
            });
        });

        test('should handle error when fetching a non-existent user for editing', async () => {
            req.params = { id: 999 };

            User.findById.mockResolvedValue(null);

            await adminController.getEditId(req, res);

            expect(User.findById).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Utilisateur introuvable.',
            });
        });
    });
});
