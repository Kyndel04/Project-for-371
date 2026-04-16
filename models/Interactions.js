const mongoose = require('mongoose');

//Should create a collection for analytics for movies and user interactions (likes/dislikes)
const interactionSchema = new mongoose.Schema({
    movieTitle: { type: String, required: true },
    action: { type: String, enum: ['like', 'dislike'], required: true },
    timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Interaction', interactionSchema);