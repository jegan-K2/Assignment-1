const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    poster: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    language: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    theatres: [{ type: String }]
});

module.exports = mongoose.model('Movie', movieSchema);
