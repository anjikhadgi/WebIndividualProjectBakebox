const request = require('supertest');
const express = require('express');
const BookingRouter = require('../../routes/BookingRoute');
const Booking = require('../../model/Booking');

jest.mock('../../model/Booking', () => ({
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/booking', BookingRouter);

describe('Booking Routes', () => {
    let server;

    beforeAll(() => {
        server = app.listen(4000);
    });

    afterAll((done) => {
        server.close(done);
    });

    test('GET /api/booking/view_bookings should fetch all bookings', async () => {
        Booking.findAll.mockResolvedValue([{ id: 1, full_name: 'Dipika Maharjan' }]);
        const response = await request(app).get('/api/booking/view_bookings');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ bookings: [{ id: 1, full_name: 'Dipika Maharjan' }] });
    });

    test('GET /api/booking/:id should fetch a booking by ID', async () => {
        Booking.findByPk.mockResolvedValue({ id: 1, full_name: 'Dipika Maharjan' });
        const response = await request(app).get('/api/booking/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ booking: { id: 1, full_name: 'Dipika Maharjan' } });
    });

    test('GET /api/booking/:id should return 404 if booking not found', async () => {
        Booking.findByPk.mockResolvedValue(null);
        const response = await request(app).get('/api/booking/1');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Booking not found" });
    });

    test('POST /api/booking/create_bookings should create a new booking', async () => {
        const newBooking = {
            full_name: 'Dipika Maharjan',
            contact_number: '1234567890',
            email: 'dipika@gmail.com',
            room_name: 'Living Room',
            design_name: 'Rustic',
            date: '2025-03-02',
            description: 'Test description'
        };
        Booking.create.mockResolvedValue(newBooking);
        const response = await request(app).post('/api/booking/create_bookings').send(newBooking);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "Booking created successfully", booking: newBooking });
    });

    test('PUT /api/booking/bookings/:id should update a booking', async () => {
        const updatedBooking = {
            full_name: 'Dipika Maharjan',
            contact_number: '1234567890',
            email: 'dipika@gmail.com',
            room: 'Living Room',
            design: 'Rustic',
            date: '2025-03-02',
            description: 'Updated description'
        };
        Booking.findByPk.mockResolvedValue({
            update: jest.fn().mockResolvedValue(updatedBooking)
        });
        const response = await request(app).put('/api/booking/bookings/1').send(updatedBooking);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Booking updated successfully", booking: updatedBooking });
    });

    test('DELETE /api/booking/bookings/:id should delete a booking', async () => {
        Booking.findByPk.mockResolvedValue({
            destroy: jest.fn().mockResolvedValue({})
        });
        const response = await request(app).delete('/api/booking/bookings/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Booking deleted successfully" });
    });

    test('DELETE /api/booking/bookings/:id should return 404 if booking to delete not found', async () => {
        Booking.findByPk.mockResolvedValue(null);
        const response = await request(app).delete('/api/booking/bookings/1');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Booking not found" });
    });
});