const express = require('express');
const router = express.Router();
const Interaction = require('../models/Interactions');
const { connectToDB } = require('../db');


//Route to handle the user interaction for likes an dislikes
router.post('/', async (req, res) => {
    try {
        const { movieTitle, action } = req.body;
        
        // Creates a new database record for the click
        const newInteraction = new Interaction({
            movieTitle: movieTitle,
            action: action
        });

        await newInteraction.save();
        res.status(200).json({ message: "Analytics saved successfully!" });
    } catch (error) {
        console.error("Interaction error:", error);
        res.status(500).json({ message: "Server error saving analytics" });
    }
});

router.get('/:title', async (req, res) => {
    try {
        const title = req.params.title;
        // Ask MongoDB to count the exact number of matching records
        const likeCount = await Interaction.countDocuments({ movieTitle: title, action: 'like' });
        const dislikeCount = await Interaction.countDocuments({ movieTitle: title, action: 'dislike' });
        const viewCount = await Interaction.countDocuments({ movieTitle: title, action: 'view' });
        // Send the final numbers back to the website
        res.status(200).json({ likes: likeCount, dislikes: dislikeCount, views: viewCount });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ message: "Server error fetching counts" });
    }
});

router.post('/comment', async (req, res) => {
    const userRole = req.headers['user-role'];
    
    if (userRole !== 'marketing manager') {
        return res.status(403).json({ message: "Access Denied: Only Marketing Managers can post comments." });
    }

    try {
        const { movieTitle, commentText } = req.body;
        
        const newInteraction = new Interaction({
            movieTitle: movieTitle,
            action: 'comment', // We explicitly tell the database this interaction is a comment
            commentText: commentText
        });

        await newInteraction.save();
        res.status(201).json({ message: "Comment saved successfully!" });
    } catch (error) {
        console.error("Error saving comment:", error);
        res.status(500).json({ message: "Server error saving comment" });
    }
});

// GET ROUTE: Fetch only the comments for a specific movie
router.get('/comments/:title', async (req, res) => {
    try {
        const title = req.params.title;
        // Search the Interactions database, but ONLY return the ones where action is 'comment'
        const comments = await Interaction.find({ movieTitle: title, action: 'comment' });
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Server error fetching comments" });
    }
});

module.exports = router;