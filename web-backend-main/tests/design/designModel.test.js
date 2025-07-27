const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Define the mock Design model
const DesignMock = dbMock.define('Design', {
    id: 1,
    title: 'Modern Living Room',
    image: 'modern-living-room.jpg',
    description: 'A modern living room design with minimalist furniture.',
    room: 'Living Room',
    style: 'Modern'
});

// Example test case for creating a new design
describe('Design Model', () => {
    it('should create a new design', async () => {
        const design = await DesignMock.create({
            title: 'Modern Living Room',
            image: 'modern-living-room.jpg',
            description: 'A modern living room design with minimalist furniture.',
            room: 'Living Room',
            style: 'Modern'
        });

        expect(design.title).toBe('Modern Living Room');
        expect(design.image).toBe('modern-living-room.jpg');
        expect(design.description).toBe('A modern living room design with minimalist furniture.');
        expect(design.room).toBe('Living Room');
        expect(design.style).toBe('Modern');
    });

    it('should update a design', async () => {
        const design = await DesignMock.create({
            title: 'Modern Living Room',
            image: 'modern-living-room.jpg',
            description: 'A modern living room design with minimalist furniture.',
            room: 'Living Room',
            style: 'Modern'
        });

        await design.update({
            title: 'Updated Modern Living Room',
            description: 'An updated modern living room design with new furniture.'
        });

        expect(design.title).toBe('Updated Modern Living Room');
        expect(design.description).toBe('An updated modern living room design with new furniture.');
    });

    it('should delete a design', async () => {
        const design = await DesignMock.create({
            title: 'Modern Living Room',
            image: 'modern-living-room.jpg',
            description: 'A modern living room design with minimalist furniture.',
            room: 'Living Room',
            style: 'Modern'
        });

        await design.destroy();

        const foundDesign = await DesignMock.findByPk(design.id);
        expect(foundDesign).toBeNull();
    });
});