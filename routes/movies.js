const express = require('express');
const router = express.Router();
const Movie = require('../models/Movies');

// GET ROUTE: Anyone can view the movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching movies" });
    }
});

// POST ROUTE: Only "content editors" can add a movie
router.post('/', async (req, res) => {
    const userRole = req.headers['user-role'];
    
    if (userRole !== 'content editor') {
        return res.status(403).json({ message: "Access Denied: You do not have permission to add movies." });
    }

    try {
        const { title, posterUrl, description, videoUrl } = req.body; 
        
        const newMovie = new Movie({
            title: title,
            posterUrl: posterUrl,
            description: description,
            videoUrl: videoUrl
        });

        await newMovie.save();
        res.status(201).json({ message: "Movie successfully added to the database!" });
    } catch (error) {
        console.error("Error adding movie:", error);
        res.status(500).json({ message: "Server error adding movie" });
    }
});

// DELETE ROUTE: Only "content editors" can delete a movie
router.delete('/:id', async (req, res) => {
    const userRole = req.headers['user-role'];
    
    if (userRole !== 'content editor') {
        return res.status(403).json({ message: "Access Denied: You do not have permission to delete movies." });
    }

    try {
        const movieId = req.params.id; 
        await Movie.findByIdAndDelete(movieId);
        res.status(200).json({ message: "Movie successfully deleted!" });
    } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ message: "Server error deleting movie" });
    }
});

module.exports = router;