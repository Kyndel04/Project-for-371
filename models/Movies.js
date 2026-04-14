const mongoose = require('mongoose');
const crypto = require('crypto');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    posterUrl: { type: String, required: true }
})

module.exports = mongoose.model('Movie', movieSchema);