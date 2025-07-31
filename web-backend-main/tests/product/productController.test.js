const ProductController = require('../../controller/ProductController'); // Updated import
const Product = require('../../model/Product'); // Updated import

// Mock the Product model
jest.mock('../../model/Product', () => ({ // Updated mock target
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

describe('Product Controller', () => { // Updated test suite description
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
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('should fetch all products', async () => { // Updated test description
        Product.findAll.mockResolvedValue([{ id: 1, title: 'Modern Living Room' }]); // Updated model usage
        await ProductController.findAll(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ products: [{ id: 1, title: 'Modern Living Room' }] }); // Updated key
    });

    test('should fetch a product by ID', async () => { // Updated test description
        req.params.id = 1;
        Product.findByPk.mockResolvedValue({ id: 1, title: 'Modern Living Room' }); // Updated model usage
        await ProductController.findById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ product: { id: 1, title: 'Modern Living Room' } }); // Updated key
    });

    test('should return 404 if product not found', async () => { // Updated test description
        req.params.id = 1;
        Product.findByPk.mockResolvedValue(null); // Updated model usage
        await ProductController.findById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Product not found" }); // Updated message
    });

    test('should create a new product', async () => { // Updated test description
        req.body = {
            title: 'Pastry Delight',
            image: '1753770224540.webp',
            description: 'A pastry delight product with new taste',
            quantity: '1',
            price: '10$'
        };
        // Mock req.file for the controller's save function
        req.file = { filename: '1753770224540.webp' }; 
        
        Product.create.mockResolvedValue({ // Updated model usage
            ...req.body, 
            image: req.file.filename // Simulate saving with filename from multer
        });

        await ProductController.save(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Product created successfully", 
            data: { // Controller returns 'data' key for new item
                ...req.body, 
                image: req.file.filename
            } 
        }); // Updated message and key
    });

    test('should update a product', async () => { // Updated test description
        req.params.id = 1;
        req.body = {
            title: 'Updated Pastry Delight',
            image: '1753770224540.webp',
            description: 'An updated pastry delight product with new taste.',
            quantity: '1',
            price: '10$'
        };
        // Mock an existing product found by findByPk
        const mockProductInstance = {
            update: jest.fn().mockResolvedValue(req.body)
        };
        Product.findByPk.mockResolvedValue(mockProductInstance); // Updated model usage

        await ProductController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(req.body); // Updated message and key
    });

    test('should delete a product', async () => { // Updated test description
        req.params.id = 1;
        Product.findByPk.mockResolvedValue({ // Updated model usage
            destroy: jest.fn().mockResolvedValue({})
        });
        await ProductController.deleteById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Product deleted successfully" }); // Updated message
    });

    test('should return 404 if product to delete not found', async () => { // Updated test description
        req.params.id = 1;
        Product.findByPk.mockResolvedValue(null); // Updated model usage
        await ProductController.deleteById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Product not found" }); // Updated message
    });
});