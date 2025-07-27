const DesignController = require('../../controller/DesignController');
const Design = require('../../model/Design');

jest.mock('../../model/Design', () => ({
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

describe('Design Controller', () => {
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
    });

    test('should fetch all designs', async () => {
        Design.findAll.mockResolvedValue([{ id: 1, title: 'Modern Living Room' }]);
        await DesignController.findAll(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ designs: [{ id: 1, title: 'Modern Living Room' }] });
    });

    test('should fetch a design by ID', async () => {
        req.params.id = 1;
        Design.findByPk.mockResolvedValue({ id: 1, title: 'Modern Living Room' });
        await DesignController.findById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ design: { id: 1, title: 'Modern Living Room' } });
    });

    test('should return 404 if design not found', async () => {
        req.params.id = 1;
        Design.findByPk.mockResolvedValue(null);
        await DesignController.findById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Design not found" });
    });

    test('should create a new design', async () => {
        req.body = {
            title: 'Modern Living Room',
            image: 'modern-living-room.jpg',
            description: 'A modern living room design with minimalist furniture.',
            room: 'Living Room',
            style: 'Modern'
        };
        Design.create.mockResolvedValue(req.body);
        await DesignController.save(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Design created successfully", design: req.body });
    });

    test('should update a design', async () => {
        req.params.id = 1;
        req.body = {
            title: 'Updated Modern Living Room',
            image: 'modern-living-room.jpg',
            description: 'An updated modern living room design with new furniture.',
            room: 'Living Room',
            style: 'Modern'
        };
        Design.findByPk.mockResolvedValue({
            update: jest.fn().mockResolvedValue(req.body)
        });
        await DesignController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Design updated successfully", design: req.body });
    });

    test('should delete a design', async () => {
        req.params.id = 1;
        Design.findByPk.mockResolvedValue({
            destroy: jest.fn().mockResolvedValue({})
        });
        await DesignController.deleteById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Design deleted successfully" });
    });

    test('should return 404 if design to delete not found', async () => {
        req.params.id = 1;
        Design.findByPk.mockResolvedValue(null);
        await DesignController.deleteById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Design not found" });
    });
});