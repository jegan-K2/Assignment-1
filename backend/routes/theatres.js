const express = require('express');
const router = express.Router();
const Theatre = require('../models/Theatre');
const auth = require('../middleware/auth');

// GET all theatres
router.get('/', async (req, res) => {
    try {
        const { district, state } = req.query;
        let query = {};
        
        // Always filter by Tami Nadu if not specified, 
        // but user specifically asked for district filtering.
        if (district) {
            query.district = district;
        }
        
        // If state is requested, add it, but usually we just want district for TN
        if (state && state !== 'null' && state !== 'undefined') {
            query.state = state;
        }
        
        const theatres = await Theatre.find(query);
        res.json(theatres);
    } catch (err) {
        console.error("Error fetching theatres:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST a new theatre — admin only
router.post('/', auth(['admin']), async (req, res) => {
    try {
        const { name, district, state, screens } = req.body;
        
        if (!name || !district) {
            return res.status(400).json({ error: 'Theatre Name and District are required' });
        }

        // Default screens if none provided or if it's not an array
        let theatreScreens = screens;
        if (!Array.isArray(theatreScreens) || theatreScreens.length === 0) {
            theatreScreens = [
                { name: "Screen 1", timings: ["10:00 AM", "06:00 PM"], seats: [] },
                { name: "Screen 2", timings: ["01:00 PM", "10:00 PM"], seats: [] }
            ];
        }

        const newTheatre = new Theatre({
            name,
            district,
            state: state || "Tamil Nadu",
            screens: theatreScreens
        });

        await newTheatre.save();
        res.status(201).json({ success: true, theatre: newTheatre });
    } catch (err) {
        console.error("Error adding theatre:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
