const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    // We removed 'required: true' here because the code below will generate it for us!
    posterUrl: { type: String }, 
    description: { type: String, default: "No description available." },
    videoUrl: { type: String, required: true }
});

movieSchema.pre('save', function() { 
    
    // Check if the movie has a videoUrl, but is missing a posterUrl
    if (this.videoUrl && !this.posterUrl) {
        
        // Make sure it is actually a YouTube link
        if (this.videoUrl.includes('youtube.com/watch?v=')) {
            
            // This splits the link at "v=" and grabs the 11-character video ID!
            const videoId = this.videoUrl.split('v=')[1].substring(0, 11);
            
            // Automatically build the thumbnail link and save it as the posterUrl
            this.posterUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
    }
    
    // We completely removed the next() call down here!
});

module.exports = mongoose.model('Movie', movieSchema);