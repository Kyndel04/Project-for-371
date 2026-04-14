const express = require('express');
const router = express.Router();
const Movie = require('../models/Movies');

// Get all movies (GET /api/movies)
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching movies" });
    }
});

module.exports = router;