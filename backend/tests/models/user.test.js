const User = require('../../models/user');

jest.mock('../../models/user');

describe('User Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a user successfully', async () => {
        const mockUser = {
            id: 1,
            username: 'test',
            email: 'test@example.com',
            password: 'hashedpassword',
            roles: ['ROLE_USER'],
        };
        User.create.mockResolvedValue(mockUser);

        const result = await User.create({
            username: 'test',
            email: 'test@example.com',
            password: 'hashedpassword',
            roles: ['ROLE_USER'],
        });
        expect(User.create).toHaveBeenCalledWith({
            username: 'test',
            email: 'test@example.com',
            password: 'hashedpassword',
            roles: ['ROLE_USER'],
        });
        expect(result).toEqual(mockUser);
    });

    test('should return an existing user by username', async () => {
        const mockUser = { id: 1, username: 'test', email: 'test@example.com', roles: ['ROLE_USER'] };
        User.findByUsername.mockResolvedValue(mockUser);

        const result = await User.findByUsername('test');
        expect(User.findByUsername).toHaveBeenCalledWith('test');
        expect(result).toEqual(mockUser);
    });

    test('should return an existing user by username or email', async () => {
        const mockUser = { id: 1, username: 'test', email: 'test@example.com', roles: ['ROLE_USER'] };
        User.findByUsernameOrEmail.mockResolvedValue(mockUser);

        const result = await User.findByUsernameOrEmail('test', 'test@example.com');
        expect(User.findByUsernameOrEmail).toHaveBeenCalledWith('test', 'test@example.com');
        expect(result).toEqual(mockUser);
    });

    test('should return an existing user by ID', async () => {
        const mockUser = { id: 1, username: 'test', email: 'test@example.com', roles: ['ROLE_USER'] };
        User.findById.mockResolvedValue(mockUser);

        const result = await User.findById(1);
        expect(User.findById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockUser);
    });

    test('should delete a user successfully', async () => {
        User.delete.mockResolvedValue(1);

        const result = await User.delete(1);

        expect(User.delete).toHaveBeenCalledWith(1);
        expect(result).toEqual(1);
    });

    test('should update user roles successfully', async () => {
        const updatedUser = { id: 1, roles: ['ROLE_ADMIN'] };
        User.update.mockResolvedValue(updatedUser);

        const result = await User.update(1, { roles: JSON.stringify(['ROLE_ADMIN']) });

        expect(User.update).toHaveBeenCalledWith(1, { roles: JSON.stringify(['ROLE_ADMIN']) });
        expect(result).toEqual(updatedUser);
    });

    test('should fetch all users successfully', async () => {
        const mockUsers = [
            { id: 1, username: 'test1', email: 'test1@example.com', roles: ['ROLE_USER'] },
            { id: 2, username: 'test2', email: 'test2@example.com', roles: ['ROLE_ADMIN'] },
        ];
        User.getAll.mockResolvedValue(mockUsers);

        const result = await User.getAll();

        expect(User.getAll).toHaveBeenCalled();
        expect(result).toEqual(mockUsers);
    });
});
