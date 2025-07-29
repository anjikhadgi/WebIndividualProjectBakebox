const request = require('supertest');
const express = require('express');
const OrderRouter = require('../../routes/OrderRoute'); // Updated import
const Order = require('../../model/Order'); // Updated import

// Mock the Order model
jest.mock('../../model/Order', () => ({
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

const app = express();
app.use(express.json());
// Mount the OrderRouter with the new base path /api/orders
app.use('/api/orders', OrderRouter); // Updated base path

describe('Order Routes', () => { // Updated test suite description
    let server;

    beforeAll(() => {
        // It's good practice to make sure the server is fully started before tests run
        // You might want to use a port that's not 4000 if your dev server also uses it
        server = app.listen(0); // Listen on a random available port
    });

    afterAll((done) => {
        server.close(done);
    });

    // Clear all mocks before each test to ensure isolation
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/orders/view_orders should fetch all orders', async () => { // Updated test description and route
        Order.findAll.mockResolvedValue([{ id: 1, full_name: 'Anji Khadgi' }]);
        const response = await request(app).get('/api/orders/view_orders'); // Updated route
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ orders: [{ id: 1, full_name: 'Anji Khadgi' }] }); // Updated key
    });

    test('GET /api/orders/:id should fetch an order by ID', async () => { // Updated test description and route
        Order.findByPk.mockResolvedValue({ id: 1, full_name: 'Anji Khadgi' });
        const response = await request(app).get('/api/orders/1'); // Updated route
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ order: { id: 1, full_name: 'Anji Khadgi' } }); // Updated key
    });

    test('GET /api/orders/:id should return 404 if order not found', async () => { // Updated test description and route
        Order.findByPk.mockResolvedValue(null);
        const response = await request(app).get('/api/orders/1'); // Updated route
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Order not found" }); // Updated message
    });

    test('POST /api/orders/create_order should create a new order', async () => { // Updated test description and route
        const newOrder = {
            full_name: 'Anji Khadgi',
            contact_number: '1234567890',
            email: 'anji@gmail.com',
            quantity: '1', // Updated field name
            product_name: 'Chocolate',    // Updated field name
            order_date: '2025-03-02', // Updated field name
            description: 'Test description'
        };
        Order.create.mockResolvedValue(newOrder);
        // Updated route and sent data to match Order model's new date field
        const response = await request(app).post('/api/orders/create_order').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "Order created successfully", order: newOrder }); // Updated message and key
    });

    test('PUT /api/orders/orders/:id should update an order', async () => { // Updated test description and route
        const updatedOrder = {
            full_name: 'Anji Khadgi',
            contact_number: '1234567890',
            email: 'anji@gmail.com',
            quantity: '1', // Updated field name
            product_name: 'Chocolate',    // Updated field name
            order_date: '2025-03-02', // Updated field name
            description: 'Updated description'
        };
        Order.findByPk.mockResolvedValue({
            update: jest.fn().mockResolvedValue(updatedOrder)
        });
        // Updated route and sent data to match Order model's new date field
        const response = await request(app).put('/api/orders/orders/1').send(updatedOrder);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Order updated successfully", order: updatedOrder }); // Updated message and key
    });

    test('DELETE /api/orders/orders/:id should delete an order', async () => { // Updated test description and route
        Order.findByPk.mockResolvedValue({
            destroy: jest.fn().mockResolvedValue({})
        });
        const response = await request(app).delete('/api/orders/orders/1'); // Updated route
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Order deleted successfully" }); // Updated message
    });

    test('DELETE /api/orders/orders/:id should return 404 if order to delete not found', async () => { // Updated test description and route
        Order.findByPk.mockResolvedValue(null);
        const response = await request(app).delete('/api/orders/orders/1'); // Updated route
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Order not found" }); // Updated message
    });
});