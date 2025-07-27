const BookingController = require('../../controller/BookingController');
const Booking = require('../../model/Booking');

jest.mock('../../model/Booking', () => ({
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

describe('Booking Controller', () => {
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

    test('should fetch all bookings', async () => {
        Booking.findAll.mockResolvedValue([{ id: 1, full_name: 'Dipika Maharjan' }]);
        await BookingController.findAll(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ bookings: [{ id: 1, full_name: 'Dipika Maharjan' }] });
    });

    test('should fetch a booking by ID', async () => {
        req.params.id = 1;
        Booking.findByPk.mockResolvedValue({ id: 1, full_name: 'Dipika Maharjan' });
        await BookingController.findById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ booking: { id: 1, full_name: 'Dipika Maharjan' } });
    });

    test('should return 404 if booking not found', async () => {
        req.params.id = 1;
        Booking.findByPk.mockResolvedValue(null);
        await BookingController.findById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Booking not found" });
    });

    test('should create a new booking', async () => {
        req.body = {
            full_name: 'Dipika Maharjan',
            contact_number: '1234567890',
            email: 'dipika@gmail.com',
            room_name: 'Living Room',
            design_name: 'Rustic',
            date: '2025-03-02',
            description: 'Test description'
        };
        Booking.create.mockResolvedValue(req.body);
        await BookingController.save(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Booking created successfully", booking: req.body });
    });

    test('should update a booking', async () => {
        req.params.id = 1;
        req.body = {
            full_name: 'Dipika Maharjan',
            contact_number: '1234567890',
            email: 'dipika@gmail.com',
            room: 'Living Room',
            design: 'Rustic',
            date: '2025-03-02',
            description: 'Updated description'
        };
        Booking.findByPk.mockResolvedValue({
            update: jest.fn().mockResolvedValue(req.body)
        });
        await BookingController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Booking updated successfully", booking: req.body });
    });

    test('should delete a booking', async () => {
        req.params.id = 1;
        Booking.findByPk.mockResolvedValue({
            destroy: jest.fn().mockResolvedValue({})
        });
        await BookingController.deleteById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Booking deleted successfully" });
    });

    test('should return 404 if booking to delete not found', async () => {
        req.params.id = 1;
        Booking.findByPk.mockResolvedValue(null);
        await BookingController.deleteById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Booking not found" });
    });
});