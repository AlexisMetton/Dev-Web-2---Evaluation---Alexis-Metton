const bcrypt = require('bcrypt');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user');

const { JSDOM } = require('jsdom');

jest.mock('../../models/user');

describe('Auth Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should register a new user', async () => {
        User.findByUsernameOrEmail.mockResolvedValue(null);
        User.create.mockResolvedValue({ id: 1, username: 'test' });

        const response = await request(app)
            .post('/register')
            .send({
                username: 'test',
                password: 'Password123!',
                email: 'test@example.com',
            });

        expect(User.findByUsernameOrEmail).toHaveBeenCalledWith('test', 'test@example.com');
        expect(User.create).toHaveBeenCalledWith({
            username: 'test',
            password: expect.any(String),
            email: 'test@example.com',
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            message: 'Inscription réussie',
            token: expect.any(String),
            user: {
                id: 1,
                username: 'test',
                roles: ['ROLE_USER'],
            },
        });
    });

    test('should not register a user with an existing username or email', async () => {
        User.findByUsernameOrEmail.mockResolvedValue({ id: 1, username: 'test' });

        const response = await request(app)
            .post('/register')
            .send({
                username: 'test',
                password: 'Password123!',
                email: 'test@example.com',
            });

        expect(User.findByUsernameOrEmail).toHaveBeenCalledWith('test', 'test@example.com');
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Le nom d'utilisateur ou l'email existe déjà." });
    });

    test('should login an existing user', async () => {
        const hashedPassword = await bcrypt.hash('test', 10);
        const mockUser = { id: 1, username: 'test', password: hashedPassword, roles: ['ROLE_USER'] };
        User.findByUsername.mockResolvedValue(mockUser);

        const response = await request(app).post('/login').send({
            username: 'test',
            password: 'test',
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Connexion réussie',
            token: expect.any(String),
            user: {
                id: 1,
                username: 'test',
                roles: ['ROLE_USER'],
            },
        });
    });

    test('should return error when logging in with invalid username', async () => {
        User.findByUsername.mockResolvedValue(null);

        const response = await request(app).post('/login').send({
            username: 'invalidUser',
            password: 'test',
        });


        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Pseudo ou mot de passe invalide.' });
    });

    test('should return error when logging in with incorrect password', async () => {
        const hashedPassword = await bcrypt.hash('test', 10);
        const mockUser = { id: 1, username: 'test', password: hashedPassword, roles: ['ROLE_USER'] };
        User.findByUsername.mockResolvedValue(mockUser);

        const response = await request(app).post('/login').send({
            username: 'test',
            password: 'wrongPassword',
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Pseudo ou mot de passe invalide.' });
    });

    test('should logout the logged-in user', async () => {
        const agent = request.agent(app);

        const logoutResponse = await agent.get('/logout');

        expect(logoutResponse.statusCode).toBe(200);
        expect(logoutResponse.body).toEqual({ message: 'Déconnexion réussie.' });
    });
});

describe('Password Validation', () => {
    it('should reject passwords shorter than 8 characters', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Short1!'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
    });

    it('should reject passwords without uppercase letters', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123!'
            });
  
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Le mot de passe doit contenir au moins une lettre majuscule.' });
    });

    it('should reject passwords without lowercase letters', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'PASSWORD123!'
            });
  
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Le mot de passe doit contenir au moins une lettre minuscule.' });    
    });

    it('should reject passwords without numbers', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Password!'
            });
   
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Le mot de passe doit contenir au moins un chiffre.' });    
    });

    it('should reject passwords without special characters', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Password123'
            });
    
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?":{}|<>).' });    
    });

    it('should reject passwords with spaces', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Password 123!'
            });
    
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Le mot de passe ne doit pas contenir d\'espaces.' });    

    });
});