const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    seats: [{ type: String }],
    totalPrice: { type: Number, required: true },
    bookingId: { type: String, required: true },
    movieName: { type: String },
    theatreName: { type: String },
    screenName: { type: String },
    showTiming: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
