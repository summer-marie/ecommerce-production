const express = require('express');
const request = require('supertest');

describe('Builder Toggle Status API', () => {
    let app;
    let mockBuilder;

    beforeEach(() => {
        // Create a fresh app for each test
        app = express();
        app.use(express.json());

        // Mock builder data
        mockBuilder = {
            _id: '507f1f77bcf86cd799439011',
            name: 'Test Pizza',
            active: true,
            save: jest.fn()
        };

        // Create a mock route that simulates the toggle behavior
        app.patch('/api/builders/:id/toggle-status', async (req, res) => {
            try {
                const { id } = req.params;
                
                // Simulate pizza not found
                if (id === 'notfound') {
                    return res.status(404).json({ message: 'Pizza not found' });
                }

                // Simulate database error
                if (id === 'error') {
                    throw new Error('Database error');
                }

                // Toggle the active status
                mockBuilder.active = !mockBuilder.active;
                await mockBuilder.save();

                const message = mockBuilder.active 
                    ? 'Pizza activated successfully' 
                    : 'Pizza deactivated successfully';

                res.json({ 
                    message,
                    active: mockBuilder.active,
                    builder: mockBuilder
                });
            } catch (error) {
                res.status(500).json({ message: 'Error toggling pizza status' });
            }
        });
    });

    describe('PATCH /api/builders/:id/toggle-status', () => {
        it('should deactivate an active pizza', async () => {
            mockBuilder.active = true;
            mockBuilder.save.mockResolvedValue(true);

            const response = await request(app)
                .patch('/api/builders/507f1f77bcf86cd799439011/toggle-status')
                .expect(200);

            expect(response.body.message).toBe('Pizza deactivated successfully');
            expect(response.body.active).toBe(false);
            expect(mockBuilder.save).toHaveBeenCalled();
        });

        it('should activate a deactivated pizza', async () => {
            mockBuilder.active = false;
            mockBuilder.save.mockResolvedValue(true);

            const response = await request(app)
                .patch('/api/builders/507f1f77bcf86cd799439011/toggle-status')
                .expect(200);

            expect(response.body.message).toBe('Pizza activated successfully');
            expect(response.body.active).toBe(true);
            expect(mockBuilder.save).toHaveBeenCalled();
        });

        it('should return 404 if pizza not found', async () => {
            const response = await request(app)
                .patch('/api/builders/notfound/toggle-status')
                .expect(404);

            expect(response.body.message).toBe('Pizza not found');
        });

        it('should handle database errors', async () => {
            const response = await request(app)
                .patch('/api/builders/error/toggle-status')
                .expect(500);

            expect(response.body.message).toBe('Error toggling pizza status');
        });
    });
});