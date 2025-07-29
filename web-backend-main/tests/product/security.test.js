const request = require('supertest');
const express = require('express');
const ProductRouter = require('../../routes/ProductRoute'); // Updated import
const { authenticateToken } = require('../../middleware/Auth');
const Product = require('../../model/Product'); // Updated import

// Mock the Product model
jest.mock('../../model/Product', () => ({ // Updated mock target
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
// Mount the ProductRouter with the new base path /api/products
// The authenticateToken middleware should be correctly mocked or implemented to pass the tests
app.use('/api/products', authenticateToken, ProductRouter); // Updated base path

describe('Product Routes Security', () => { // Updated test suite description
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
        const response = await request(app).get('/api/products/view_products'); // Updated route
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Access denied: No token provided" });
    });

    test('should return 403 if token is invalid', async () => {
        // Mock jsonwebtoken.verify to simulate an invalid token
        require('jsonwebtoken').verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token')); // Simulate invalid token error
        });

        const response = await request(app)
            .get('/api/products/view_products') // Updated route
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

        // Mock the Product model's findAll for the successful test
        // The controller directly returns an array for findAll, not an object with 'designs' key
        Product.findAll.mockResolvedValue([{ id: 1, title: 'Pastry Delight' }]);
        
        const response = await request(app)
            .get('/api/products/view_products') // Updated route
            .set('Authorization', `Bearer ${validToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, title: 'Pastry Delight' }]); // Updated to match controller's output
    });
});