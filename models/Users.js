const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true, minLength: 8, maxLength: 16 },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['viewer', 'content editor', 'marketing manager'],
        default: 'viewer'
    }
    
})

// Hash the password using SHA-256 before saving to the database
userSchema.pre('save', function() { // <-- Add "next" right here!
    if (this.isModified('password')) {
        this.password = crypto.createHash('sha256').update(this.password).digest('hex');
    }
});


module.exports = mongoose.model('Users', userSchema);