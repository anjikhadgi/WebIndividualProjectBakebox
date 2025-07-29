const OrderController = require('../../controller/OrderController'); // Updated import
const Order = require('../../model/Order'); // Updated import

// Mock the Order model
jest.mock('../../model/Order', () => ({
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

describe('Order Controller', () => { // Updated test suite description
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    let req, res;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = mockResponse();
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('should fetch all orders', async () => { // Updated test description
        Order.findAll.mockResolvedValue([{ id: 1, full_name: 'Anji Khadgi' }]);
        await OrderController.findAll(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ orders: [{ id: 1, full_name: 'Anji Khadgi' }] }); // Updated key
    });

    test('should fetch an order by ID', async () => { // Updated test description
        req.params.id = 1;
        Order.findByPk.mockResolvedValue({ id: 1, full_name: 'Anji Khadgi' });
        await OrderController.findById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ order: { id: 1, full_name: 'Anji Khadgi' } }); // Updated key
    });

    test('should return 404 if order not found', async () => { // Updated test description
        req.params.id = 1;
        Order.findByPk.mockResolvedValue(null);
        await OrderController.findById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Order not found" }); // Updated message
    });

    test('should create a new order', async () => { // Updated test description
        req.body = {
            full_name: 'Anji Khadgi',
            contact_number: '1234567890',
            email: 'anji@gmail.com',
            qunatity: '1', // Updated field name
            product_name: 'Chocolate',    // Updated field name
            order_date: '2025-03-02', // Updated field name
            description: 'Test description'
        };
        Order.create.mockResolvedValue(req.body);
        await OrderController.save(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Order created successfully", order: req.body }); // Updated message and key
    });

    test('should update an order', async () => { // Updated test description
        req.params.id = 1;
        req.body = {
            full_name: 'Anji Khadgi',
            contact_number: '1234567890',
            email:'anji@gmail.com',
            quantity: '1', // Updated field name
            product_name: 'Chocolate',    // Updated field name
            order_date: '2025-03-02', // Updated field name
            description: 'Updated description'
        };
        Order.findByPk.mockResolvedValue({
            update: jest.fn().mockResolvedValue(req.body)
        });
        await OrderController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Order updated successfully", order: req.body }); // Updated message and key
    });

    test('should delete an order', async () => { // Updated test description
        req.params.id = 1;
        Order.findByPk.mockResolvedValue({
            destroy: jest.fn().mockResolvedValue({})
        });
        await OrderController.deleteById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Order deleted successfully" }); // Updated message
    });

    test('should return 404 if order to delete not found', async () => { // Updated test description
        req.params.id = 1;
        Order.findByPk.mockResolvedValue(null);
        await OrderController.deleteById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Order not found" }); // Updated message
    });
});