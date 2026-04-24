const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    posterUrl: { type: String, required: true },
    description: { type: String, default: "No description available." },
    videoUrl: { type: String, required: true }
});

module.exports = mongoose.model('Movie', movieSchema);