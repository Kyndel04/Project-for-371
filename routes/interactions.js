const express = require('express');
const router = express.Router();
const Interaction = require('../models/Interactions');

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
        
        // Send the final numbers back to the website
        res.status(200).json({ likes: likeCount, dislikes: dislikeCount });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ message: "Server error fetching counts" });
    }
});

module.exports = router;