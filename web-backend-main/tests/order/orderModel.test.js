const { MdProductionQuantityLimits } = require('react-icons/md');
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Define the mock Order model
const OrderMock = dbMock.define('Order', { // Updated model name
    id: 1,
    full_name: 'Anji Khadgi',
    contact_number: '9800000000',
    email: 'anji@gmail.com',
    quantity: '1',
    product_name: 'Contemporary',
    order_date: '2025-03-01', // Updated field name
    description: 'A test order' // Updated description
});

// Example test case for creating a new order
describe('Order Model', () => { // Updated test suite description
    it('should create a new order', async () => { // Updated test case description
        const order = await OrderMock.create({ // Updated variable and model name
            full_name: 'Anji Khadgi',
            contact_number: '9800000000',
            email: 'anji@gmail.com',
            quantity: '1',
            product_name: 'Contemporary',
            order_date: '2025-03-10', // Updated field name
            description: 'Another test order' // Updated description
        });

        expect(order.full_name).toBe ('Anji Khadgi'),
        expect(order.contact_number).toBe('9800000000');
        expect(order.email).toBe('anji@gmail.com');
        expect(order.quantity).toBe('1');
        expect(order.product_name).toBe('Contemporary');
        expect(order.order_date).toBe('2025-03-10'); // Updated assertion field name
        expect(order.description).toBe('Another test order');
    });
});