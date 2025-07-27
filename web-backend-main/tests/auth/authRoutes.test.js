const request = require('supertest');
const express = require('express');
const AuthRouter = require('../../routes/AuthRoute');
const Cred = require('../../model/Credential');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../model/Credential', () => ({
    findOne: jest.fn(),
    create: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/auth', AuthRouter);

describe('Auth Routes', () => {
    let server;

    beforeAll(() => {
        server = app.listen(4000);
    });

    afterAll((done) => {
        server.close(done);
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const newUser = { username: 'dipika', password: '123456', role: 'user' };
            const hashedPassword = await bcrypt.hash(newUser.password, 10);
            Cred.create.mockResolvedValue({ ...newUser, password: hashedPassword });

            const response = await request(app).post('/api/auth/register').send(newUser);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'User registered successfully', user: { ...newUser, password: hashedPassword } });
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login a user and return a token', async () => {
            const user = { username: 'dipika', password: '123456', role: 'user' };
            const hashedPassword = await bcrypt.hash(user.password, 10);
            Cred.findOne.mockResolvedValue({ ...user, password: hashedPassword });

            const response = await request(app).post('/api/auth/login').send({ username: user.username, password: user.password });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should return 403 if username or password is incorrect', async () => {
            Cred.findOne.mockResolvedValue(null);

            const response = await request(app).post('/api/auth/login').send({ username: 'wronguser', password: 'wrongpassword' });
            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Invalid username or password' });
        });
    });
});