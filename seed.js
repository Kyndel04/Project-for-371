global.crypto = require('crypto');

const mongoose = require('mongoose');
const User = require('./models/Users'); // Points to the User.js model we created earlier
const Movie = require('./models/Movies');
const { connectToDB } = require('./db');

const seedUsers = async () => {
    try {
        // Clear out existing users to prevent duplicates during testing
        await connectToDB();
        await User.deleteMany({}); 
        await Movie.deleteMany({}); 

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

        // ==========================================
        // 2. SEED MOVIES <-- ADDED THIS WHOLE SECTION
        // ==========================================
        // Replace these with your actual movie data! Make sure the fields 
        // match what you set up in your Movies.js schema.
        const movies = [
            {
                title: "The Matrix",
                description: "A computer hacker learns about the true nature of his reality.",
                videoUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8", 
                
            },
            {
                title: "Inception",
                description: "A thief who steals corporate secrets through the use of dream-sharing technology.",
                videoUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0", 
                
            },
            {
                title: "Interstellar",
                description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                videoUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E", 
                
            },
            {
                title: "Batman Begins",
                description: "Bruce Wayne becomes Batman to fight crime in Gotham City.",
                videoUrl: "https://www.youtube.com/watch?v=neY2xVmOfUM&t=12s",
            },
            {
                title: "Chainsawman Movie",
                description: "Boy with a chainsaw devil inside him fights other devils in a dark and violent world.",
                videoUrl: "https://www.youtube.com/watch?v=EPaoHkV0dYw",
            },
            {
                title: "Arcane: League of Legends",
                description: "Two sisters fight for their lives in a world where magic and technology collide.",
                videoUrl: "https://www.youtube.com/watch?v=W4gLFBNGgiY",
            },
            {
                title: "JJK 0",
                description: "Yuji Itadori joins a secret organization to fight curses and save his friends.",
                videoUrl: "https://www.youtube.com/watch?v=2docezZl574",
            },
            {
                title: "Project Hail Mary",
                description: "A lone astronaut must save the world from an alien threat.",
                videoUrl: "https://www.youtube.com/watch?v=m08TxIsFTRI",
            },
            {
                title: "Hoppers",
                description: "A group of animated rabbits embark on a journey to save their home.",
                videoUrl: "https://www.youtube.com/watch?v=PypDSyIRRSs",
            },
            {
                title: "Excalibur",
                description: "FOOL",
                videoUrl: "https://www.youtube.com/watch?v=SP5y6K8xw3Y",
            },
            {
                title: "Cosmic Princess Kaguya!",
                description: " A cosmic princess from outer space comes to Earth and learns about humanity.",
                videoUrl: "https://www.youtube.com/watch?v=KAXwdY3ei7c",
            },
            {
                title: "JJK Modulo",
                description: "About Yuta Okkotsu Grandchilden",
                videoUrl: "https://www.youtube.com/watch?v=jK4mmTMxu7s",
            },
            {
                title: "Acheron Honkai Star Rail",
                description: " A mysterious train takes passengers to different worlds, where they must fight to survive.",
                videoUrl: "https://www.youtube.com/watch?v=e5xueJq4Lwc&list=RDe5xueJq4Lwc&start_radio=1",
            },
            {
                title: "BOLT",
                description: "A actor dog believes he has superpowers and embarks on a cross-country journey to save his co-star.",
                videoUrl: "https://www.youtube.com/watch?v=IBsg00NnzGg",
            },
            {
                title: "Spider-Man: New Day",
                description: "Peter Parker faces new challenges as he tries to balance his life as a superhero and a normal person.",
                videoUrl: "https://www.youtube.com/watch?v=8TZMtslA3UY",
            },
            {
                title: "Supergirl",
                description: "A young woman discovers she has superpowers and must learn to use them for good.",
                videoUrl: "https://www.youtube.com/watch?v=s1-pfiVMKAs",
            },
            {
                title: "MAKA vs CRONA",
                description: "Maka Albarn and Crona face off in a battle of wits and weapons in a dark and twisted world.",
                videoUrl: "https://www.youtube.com/watch?v=7Bp83y-Q_Uc",
            },
            {
                title: "Devil may cry",
                description: "A demon hunter with a mysterious past fights supernatural threats in a dark and dangerous world.",
                videoUrl: "https://www.youtube.com/watch?v=OlEqHXRrcpc",
            },
            {
                title: "Black clover: sword of the wizard king",
                description: "A young wizard must master his powers to become the next wizard king.",
                videoUrl: "https://www.youtube.com/watch?v=PrgxJ1_sUcs",
            },
            {
                title: "ClayFace",
                description: "The tragic story of a who becomes the villain ClayFace after a failed acting career and a disfiguring accident.",
                videoUrl: "https://www.youtube.com/watch?v=6IxPD-jNdwM",
            }
            
        ];

        for (let movieData of movies) {
            const movie = new Movie(movieData);
            await movie.save();
            console.log(`Movie "${movie.title}" automatically added to database.`);
        }

        console.log("Database seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedUsers();