
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/Users');
const { connectToDB } = require('../db');



router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash the incoming password with SHA-256 to compare with the database
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Find the user with matching username and hashed password
        const user = await User.findOne({ username: username, password: hashedPassword });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
    
}); 

module.exports = router;