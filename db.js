const mongoose = require('mongoose');

// We combine the URL and the DBName ("SCProject") into one string. 
// Note: We use 127.0.0.1 instead of localhost to prevent connection bugs in newer Node versions!
const url = "mongodb://127.0.0.1:27017/Project";

async function connectToDB() {
    try {
        await mongoose.connect(url);
        console.log('Connected to MongoDB (Project database)');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Kills the server if the database fails to connect
    }
}

// Mongoose automatically remembers the connection globally, 
// so we don't need a getDB() function! We just export the connector.
module.exports = { connectToDB };