const request = require('supertest');
const express = require('express');
const ProductRouter = require('../../routes/ProductRoute'); // Updated import
const Product = require('../../model/Product'); // Updated import
const multer = require('multer'); // Import multer to mock it

// Mock the Product model
jest.mock('../../model/Product', () => ({ // Updated mock target
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

// Mock multer's single method to allow testing file uploads
jest.mock('multer', () => {
    const multer = () => ({
        single: jest.fn(() => (req, res, next) => {
            // Mock req.file for the test
            req.file = { filename: 'test-image.jpg', path: '/path/to/test-image.jpg' };
            next();
        }),
    });
    // Add diskStorage and other necessary properties if your multer config uses them
    multer.diskStorage = jest.fn();
    return multer;
});

const app = express();
app.use(express.json());
// Mount the ProductRouter with the new base path /api/products
app.use('/api/products', ProductRouter); // Updated base path

describe('Product Routes', () => { // Updated test suite description
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

    test('GET /api/products/view_products should fetch all products', async () => { // Updated test description and route
        Product.findAll.mockResolvedValue([{ id: 1, title: 'Pastry Delight' }]); // Updated model usage
        const response = await request(app).get('/api/products/view_products'); // Updated route
        expect(response.status).toBe(200);
        // The controller sends back a direct array for findAll now, not an object with 'products' key
        expect(response.body).toEqual([{ id: 1, title: 'Pastry Delight' }]);
    });

    test('GET /api/products/:id should fetch a product by ID', async () => { // Updated test description and route
        Product.findByPk.mockResolvedValue({ id: 1, title: 'Pastry Delight' }); // Updated model usage
        const response = await request(app).get('/api/products/1'); // Updated route
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: 1, title: 'Pastry Delight' }); // Updated key (controller directly returns product)
    });

    test('GET /api/products/:id should return 404 if product not found', async () => { // Updated test description and route
        Product.findByPk.mockResolvedValue(null); // Updated model usage
        const response = await request(app).get('/api/products/1'); // Updated route
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Product not found" }); // Updated message
    });

    test('POST /api/products/create_product should create a new product', async () => { // Updated test description and route
        const newProduct = {
            title: 'Pastry Delight',
            // image is handled by multer mock
            description: 'A pastry delight product with new taste.',
            quantity: '1',
            price: '10$'
        };
        // The controller's save method uses req.file.filename for the image
        const expectedSavedProduct = { ...newProduct, image: 'test-image.jpg' };
        Product.create.mockResolvedValue(expectedSavedProduct); // Updated model usage

        const response = await request(app).post('/api/products/create_product') // Updated route
            .field('title', newProduct.title) // Use .field for form data with files
            .field('description', newProduct.description)
            .field('quantity', newProduct.room)
            .field('price', newProduct.style)
            .attach('image', Buffer.from('dummy image data'), 'test-image.jpg'); // Attach a dummy file

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "Product created successfully", data: expectedSavedProduct }); // Updated message and key
    });

    test('PUT /api/products/:id should update a product', async () => { // Updated test description and route
        const updatedProduct = {
            title: 'Updated Modern Living Room',
            // image is handled by multer mock
            description: 'An updated pastry delight product with new taste.',
            quantity: '1',
            price: '10$'
        };
        // Mock an existing product instance that can be updated
        const mockProductInstance = {
            update: jest.fn().mockResolvedValue(updatedProduct)
        };
        Product.findByPk.mockResolvedValue(mockProductInstance); // Updated model usage

        const response = await request(app).put('/api/products/1') // Updated route
            .field('title', updatedProduct.title)
            .field('description', updatedProduct.description)
            .field('quantity', updatedProduct.room)
            .field('price', updatedProduct.style)
            .attach('image', Buffer.from('dummy image data'), 'updated-image.jpg'); // Attach a dummy file for update

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedProduct); // Updated key (controller directly returns updated product)
    });

    test('DELETE /api/products/:id should delete a product', async () => { // Updated test description and route
        Product.findByPk.mockResolvedValue({ // Updated model usage
            destroy: jest.fn().mockResolvedValue({})
        });
        const response = await request(app).delete('/api/products/1'); // Updated route
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Product deleted successfully" }); // Updated message
    });

    test('DELETE /api/products/:id should return 404 if product to delete not found', async () => { // Updated test description and route
        Product.findByPk.mockResolvedValue(null); // Updated model usage
        const response = await request(app).delete('/api/products/1'); // Updated route
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Product not found" }); // Updated message
    });
});