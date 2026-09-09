const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

// GET all movies
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        const movies = await Movie.find(query);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single movie
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new movie — admin only
router.post('/', auth(['admin']), async (req, res) => {
    try {
        const { title, poster, rating, description, language, releaseDate } = req.body;
        
        if (!title || !poster || !rating || !description || !language || !releaseDate) {
            return res.status(400).json({ error: 'All fields are required including releaseDate' });
        }

        const newMovie = new Movie({
            title,
            poster,
            rating,
            description,
            language,
            releaseDate,
            theatres: []
        });

        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
