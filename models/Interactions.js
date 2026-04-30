const mongoose = require('mongoose');

//Should create a collection for analytics for movies and user interactions (likes/dislikes)
const interactionSchema = new mongoose.Schema({
movieTitle: { type: String, required: true },
    // 1. We added 'comment' to the enum list below:
    action: { type: String, enum: ['like', 'dislike', 'view', 'comment'], required: true },
    // 2. We added an optional text box for the comments:
    commentText: { type: String, required: false }, 
    timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Interaction', interactionSchema);