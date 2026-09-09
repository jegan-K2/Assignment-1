const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    state: { type: String, default: "Tamil Nadu" },
    district: { type: String, required: true },
    screens: [{
        name: { type: String, required: true },
        movieTitle: { type: String },
        timings: [{ type: String }],
        seats: { type: Array, default: [] }
    }]
});

module.exports = mongoose.model('Theatre', theatreSchema);
