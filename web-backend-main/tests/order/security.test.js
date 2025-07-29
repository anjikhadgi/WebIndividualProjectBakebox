const request = require('supertest');
const express = require('express');
const OrderRouter = require('../../routes/OrderRoute'); // Updated import
const { authenticateToken } = require('../../middleware/Auth');
const Order = require('../../model/Order'); // Updated import

// Mock the Order model
jest.mock('../../model/Order', () => ({
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

// Mock the jsonwebtoken verify function to control token behavior
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn()
}));

const app = express();
app.use(express.json());
// Mount the OrderRouter with the new base path /api/orders
// The authenticateToken middleware should be correctly mocked or implemented to pass the tests
app.use('/api/orders', authenticateToken, OrderRouter); // Updated base path

describe('Order Routes Security', () => { // Updated test suite description
    let server;

    beforeAll(() => {
        server = app.listen(0); // Listen on a random available port
    });

    afterAll((done) => {
        server.close(done);
    });

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('should return 401 if no token is provided', async () => {
        const response = await request(app).get('/api/orders/view_orders'); // Updated route
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Access denied: No token provided" });
    });

    test('should return 403 if token is invalid', async () => {
        // Mock jsonwebtoken.verify to simulate an invalid token
        require('jsonwebtoken').verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token')); // Simulate invalid token error
        });

        const response = await request(app)
            .get('/api/orders/view_orders') // Updated route
            .set('Authorization', 'Bearer invalidtoken');
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: "Invalid or expired token" });
    });

    test('should return 200 if token is valid', async () => {
        const validToken = 'validtoken';
        // Mock jsonwebtoken.verify to simulate a valid token
        require('jsonwebtoken').verify.mockImplementation((token, secret, callback) => {
            callback(null, { userId: 1, role: 'admin' }); // Mock decoded token
        });

        // Mock the Order model's findAll for the successful test
        Order.findAll.mockResolvedValue([{ id: 1, full_name: 'Anji Khadgi' }]);
        
        const response = await request(app)
            .get('/api/orders/view_orders') // Updated route
            .set('Authorization', `Bearer ${validToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ orders: [{ id: 1, full_name: 'Anji Khadgi' }] }); // Updated key
    });
});