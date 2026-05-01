global.crypto = require('crypto');

const mongoose = require('mongoose');
const User = require('./models/Users'); // Points to the User.js model we created earlier
const { connectToDB } = require('./db');

const seedUsers = async () => {
    try {
        // Clear out existing users to prevent duplicates during testing
        await connectToDB();
        await User.deleteMany({}); 

        // Array of users to automatically put in the database
        const users = [
            {
                fullName: "Admin User",
                username: "adminUser123", // 8-16 chars
                password: "Password!1",   // Meets complexity requirements
                role: "content editor"
            },
            {
                fullName: "Test Viewer",
                username: "viewerUser89", 
                password: "Password!2",   
                role: "viewer"
            },
            {
                fullName:"Content Editor",
                username: "contentEditor45",
                password: "Password!3",
                role: "content editor"
            },
            {
                fullName: "Marketing Manager",
                username: "marketingManager",
                password: "Password!4", 
                role: "marketing manager"
            }
        ];

        // The pre('save') hook in your User.js model will automatically 
        // convert these plain-text passwords into SHA-256 hashes as they save.
        for (let userData of users) {
            const user = new User(userData);
            await user.save();
            console.log(`User ${user.username} automatically added to database.`);
        }

        console.log("Database seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedUsers();