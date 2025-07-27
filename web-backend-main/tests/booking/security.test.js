const request = require('supertest');
const express = require('express');
const BookingRouter = require('../../routes/BookingRoute');
const { authenticateToken } = require('../../middleware/Auth');
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
app.use('/api/booking', authenticateToken, BookingRouter);

describe('Booking Routes Security', () => {
    let server;

    beforeAll(() => {
        server = app.listen(4000);
    });

    afterAll((done) => {
        server.close(done);
    });

    test('should return 401 if no token is provided', async () => {
        const response = await request(app).get('/api/booking/view_bookings');
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Access denied: No token provided" });
    });

    test('should return 403 if token is invalid', async () => {
        const response = await request(app)
            .get('/api/booking/view_bookings')
            .set('Authorization', 'Bearer invalidtoken');
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: "Invalid or expired token" });
    });

    test('should return 200 if token is valid', async () => {
        const validToken = 'validtoken'; // Mock a valid token
        jest.spyOn(require('jsonwebtoken'), 'verify').mockImplementation((token, secret, callback) => {
            callback(null, { userId: 1, role: 'admin' }); // Mock decoded token
        });

        Booking.findAll.mockResolvedValue([{ id: 1, full_name: 'Dipika Maharjan' }]);
        const response = await request(app)
            .get('/api/booking/view_bookings')
            .set('Authorization', `Bearer ${validToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ bookings: [{ id: 1, full_name: 'Dipika Maharjan' }] });
    });
});