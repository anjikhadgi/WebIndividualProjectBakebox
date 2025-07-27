const request = require('supertest');
const express = require('express');
const DesignRouter = require('../../routes/DesignRoute');
const Design = require('../../model/Design');

jest.mock('../../model/Design', () => ({
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/design', DesignRouter);

describe('Design Routes', () => {
    let server;

    beforeAll(() => {
        server = app.listen(4000);
    });

    afterAll((done) => {
        server.close(done);
    });

    test('GET /api/design should fetch all designs', async () => {
        Design.findAll.mockResolvedValue([{ id: 1, title: 'Modern Living Room' }]);
        const response = await request(app).get('/api/design');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ designs: [{ id: 1, title: 'Modern Living Room' }] });
    });

    test('GET /api/design/:id should fetch a design by ID', async () => {
        Design.findByPk.mockResolvedValue({ id: 1, title: 'Modern Living Room' });
        const response = await request(app).get('/api/design/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ design: { id: 1, title: 'Modern Living Room' } });
    });

    test('GET /api/design/:id should return 404 if design not found', async () => {
        Design.findByPk.mockResolvedValue(null);
        const response = await request(app).get('/api/design/1');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Design not found" });
    });

    test('POST /api/design should create a new design', async () => {
        const newDesign = {
            title: 'Modern Living Room',
            image: 'modern-living-room.jpg',
            description: 'A modern living room design with minimalist furniture.',
            room: 'Living Room',
            style: 'Modern'
        };
        Design.create.mockResolvedValue(newDesign);
        const response = await request(app).post('/api/design').send(newDesign);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "Design created successfully", design: newDesign });
    });

    test('PUT /api/design/:id should update a design', async () => {
        const updatedDesign = {
            title: 'Updated Modern Living Room',
            image: 'modern-living-room.jpg',
            description: 'An updated modern living room design with new furniture.',
            room: 'Living Room',
            style: 'Modern'
        };
        Design.findByPk.mockResolvedValue({
            update: jest.fn().mockResolvedValue(updatedDesign)
        });
        const response = await request(app).put('/api/design/1').send(updatedDesign);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Design updated successfully", design: updatedDesign });
    });

    test('DELETE /api/design/:id should delete a design', async () => {
        Design.findByPk.mockResolvedValue({
            destroy: jest.fn().mockResolvedValue({})
        });
        const response = await request(app).delete('/api/design/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Design deleted successfully" });
    });

    test('DELETE /api/design/:id should return 404 if design to delete not found', async () => {
        Design.findByPk.mockResolvedValue(null);
        const response = await request(app).delete('/api/design/1');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Design not found" });
    });
});