const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Define the mock Booking model
const BookingMock = dbMock.define('Booking', {
    id: 1,
    full_name: 'Dipika Maharjan',
    contact_number: '9800000000',
    email: 'dipika@gmail.com',
    room_name: 'Living Room',
    design_name: 'Contemporary',
    date: '2025-03-01',
    description: 'A test booking'
});

// Example test case for creating a new booking
describe('Booking Model', () => {
    it('should create a new booking', async () => {
        const booking = await BookingMock.create({
            full_name: 'Dipika Maharjan',
            contact_number: '9800000000',
            email: 'dipika@gmail.com',
            room_name: 'Living Room',
            design_name: 'Contemporary',
            date: '2025-03-10',
            description: 'Another test booking'
        });

        expect(booking.full_name).toBe('Dipika Maharjan');
        expect(booking.contact_number).toBe('9800000000');
        expect(booking.email).toBe('dipika@gmail.com');
        expect(booking.room_name).toBe('Living Room');
        expect(booking.design_name).toBe('Contemporary');
        expect(booking.date).toBe('2025-03-10');
        expect(booking.description).toBe('Another test booking');
    });
});