const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET user bookings
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET booked seats
router.get('/booked-seats', async (req, res) => {
    try {
        const { movieId, theatreId, screenName, showTiming } = req.query;
        const bookings = await Booking.find({ movieId, theatreId, screenName, showTiming });
        let bookedSeats = [];
        bookings.forEach(b => {
            bookedSeats = [...bookedSeats, ...b.seats];
        });
        res.json(bookedSeats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new booking
router.post('/', async (req, res) => {
    try {
        const bookingData = req.body;
        bookingData.bookingId = 'SH' + Math.floor(Math.random() * 1000000);
        const newBooking = new Booking(bookingData);
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
