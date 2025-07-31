const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Define the mock Product model
const ProductMock = dbMock.define('Product', { // Updated model name
    id: 1,
    title: 'Pastry Delight',
    image: '1753770224540.webp',
    description: 'A pastry delight with an innovative flavor.', // Updated description
    quantity: '1',
    price: '10$',
});

describe('Product Model', () => { // Updated test suite description
    it('should create a new product', async () => { // Updated test case description
        const product = await ProductMock.create({ // Updated variable and model name
            title: 'Pastry Delight',
            image: '1753770224540.webp',
            description: 'A pastry delight with an innovative flavor.', // Updated description
            quantity: '1',
            price: '10$'
        });

        expect(product.title).toBe('Pastry Delight');
        expect(product.image).toBe('1753770224540.webp');
        expect(product.description).toBe('A pastry delight with an innovative flavor.'); // Updated description
        expect(product.quantity).toBe('1');
        expect(product.price).toBe('10$');
    });

    it('should update a product', async () => { // Updated test case description
        const product = await ProductMock.create({ // Updated variable and model name
            title: 'Pastry Delight',
            image: '1753770224540.webp',
            description: 'A pastry delight with an innovative flavor.',
            quantity: '1',
            price: '10$'
        });

        await product.update({ // Updated variable
            title: 'Updated Pastry Delight',
            description: 'An updated pastry delight product with new taste.' // Updated description
        });

        expect(product.title).toBe('Updated Pastry Delight');
        expect(product.description).toBe('An updated pastry delight product with new taste..'); // Updated description
    });

    it('should delete a product', async () => { // Updated test case description
        const product = await ProductMock.create({ // Updated variable and model name
            title: 'Pastry Delight',
            image: '1753770224540.webp',
            description: 'A pastry delight with an innovative flavor.',
            quantity: '1',
            price: '10$'
        });

        await product.destroy(); // Updated variable

        const foundProduct = await ProductMock.findByPk(product.id); // Updated variable and model name
        expect(foundProduct).toBeNull();
    });
});