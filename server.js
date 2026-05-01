//Server is was taken from chatgbt 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { connectToDB } = require('./db'); // Pulls the function from your file
connectToDB(); // Actually runs the connection!

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/movies", require("./routes/movies"));
app.use("/api/interactions", require("./routes/interactions"));


// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});