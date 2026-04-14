//Server is was taken from chatgbt 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/movies", require("./routes/movies"));
//app.use("/api/interactions", require("./routes/interactions"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/watchmovies")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});