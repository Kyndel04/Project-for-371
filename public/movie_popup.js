// ==========================================
// 1. GET ALL DOM ELEMENTS
// ==========================================
const modal = document.getElementById('movieModal');
const closeModal = document.getElementById('closeModal');
const modaltitle = document.getElementById('modal-title');
const modalVideo = document.getElementById('modalVideo');
const modalDescription = document.getElementById('modalDescription');

const likeBtn = document.getElementById('likeBtn');
const dislikeBtn = document.getElementById('dislikeBtn');
const likeCount = document.getElementById('likeCount');
const dislikeCount = document.getElementById('dislikeCount');
const viewCount = document.getElementById('viewCount'); 
const commentInput = document.getElementById('commentInput');
const addCommentBtn = document.getElementById('addCommentBtn');
const commentContainer = document.getElementById('commentContainer');
const commentSection = document.getElementById('commentSection');


let likes = 0;
let dislikes = 0;

// ==========================================
// 2. YOUTUBE CONVERTER HELPER
// ==========================================
// Auto-converts normal YouTube links into Embed links for the iframe
function formatVideoUrl(url) {
    if (!url) return "";
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url;
}

 // Auto-extracts the YouTube thumbnail image to use as a poster
 function getYouTubeThumbnail(url) {
    if (!url) return "";
    let videoId = "";
    if (url.includes('youtube.com/watch?v=')) {
       videoId = url.split('v=')[1].split('&')[0];
    }
    else if (url.includes('youtu.be/')) {
         videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    if (videoId) {
         return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
     }
    return ""; // Returns blank if it's an MP4 or invalid link
 }

// ==========================================
// 3. GALLERY BUILDER & DELETE LOGIC
// ==========================================
const movieContainer = document.getElementById('movie-container');
const submitMovieBtn = document.getElementById('submitMovieBtn');
const userRole = sessionStorage.getItem('userRole'); // Gets the user's role from memory

// Show the editor panel immediately if they are a content editor
if (userRole === 'content editor' && document.getElementById('editor-panel')) {
    document.getElementById('editor-panel').style.display = 'block';
}



// 1. If the user is a VIEWER, completely hide the entire comment section
if (userRole === 'viewer') {
    if (commentContainer) {
        commentContainer.style.display = 'none';
    }
} 
// 2. If the user is a CONTENT EDITOR, let them see comments, but hide the "Post" tools
else if (userRole !== 'marketing manager') {
    if (commentInput) {
        commentInput.style.display = 'none';
    }
    if (addCommentBtn) {
        addCommentBtn.style.display = 'none';
    }
    
    // Optional: Add a message telling them why they can't post
    if (commentSection) {
        const warningMessage = document.createElement('p');
        warningMessage.style.color = '#aaa';
        warningMessage.style.fontStyle = 'italic';
        warningMessage.innerText = '(Only Marketing Managers can post new comments.)';
        commentSection.parentElement.appendChild(warningMessage);
    }
}

// Fetch movies from DB and build the gallery visually
async function loadGallery() {
    try {
        const response = await fetch('/api/movies');
        const movies = await response.json();
        
        movieContainer.innerHTML = ''; // Clear out the old gallery

        movies.forEach(movie => {
            // Wrap the poster in a div so we can put a delete button under it
            const wrapper = document.createElement('div');
            wrapper.style.display = 'inline-block';
            wrapper.style.textAlign = 'center';
            
            const img = document.createElement('img');
            img.src = movie.posterUrl;
            img.width = 200;
            img.className = "movie-poster";
            img.style.cursor = "pointer";
            
            // What happens when you click the poster
            img.addEventListener('click', async function() {
                modaltitle.innerText = movie.title;
                modalDescription.innerText = movie.description;
                modalVideo.src = formatVideoUrl(movie.videoUrl); 
                
                // Instantly send a "view" to the database in the background
                recordAnalytics('view', movie.title); 
                
                // Fetch the previous counts from the database
                try {
                    const res = await fetch(`/api/interactions/${encodeURIComponent(movie.title)}`);
                    if (res.ok) {
                        const data = await res.json();
                        likes = data.likes; 
                        dislikes = data.dislikes; 
                        // Add 1 visually to account for the view that just happened
                        viewCount.innerText = (data.views || 0) + 1; 
                    } else { 
                        likes = 0; dislikes = 0; viewCount.innerText = 1; 
                    }
                } catch (err) { 
                    likes = 0; dislikes = 0; viewCount.innerText = 1; 
                }
                
                likeCount.innerText = likes; 
                dislikeCount.innerText = dislikes;
                loadComments(movie.title);
                
                // Show the modal
                modal.style.display = 'block';
            });
            
            wrapper.appendChild(img);

            // ADD DELETE BUTTON LOGIC (Editors Only)
            if (userRole === 'content editor') {
                const delBtn = document.createElement('button');
                delBtn.innerText = "Delete";
                delBtn.style.display = "block";
                delBtn.style.margin = "5px auto";
                delBtn.style.backgroundColor = "#e50914";
                delBtn.style.color = "white";
                delBtn.style.cursor = "pointer";
                
                delBtn.addEventListener('click', async () => {
                    // Double check if they meant to delete it
                    if (confirm(`Are you sure you want to delete ${movie.title}?`)) {
                        await fetch(`/api/movies/${movie._id}`, {
                            method: 'DELETE',
                            headers: { 'user-role': userRole }
                        });
                        loadGallery(); // Instantly refresh the screen
                    }
                });
                wrapper.appendChild(delBtn);
            }
            
            movieContainer.appendChild(wrapper);
        });
    } catch (error) { 
        console.error("Error loading gallery:", error); 
    }
}

// ==========================================
// 4. POPUP CONTROLS (Close Modal)
// ==========================================
function closePopup() {
    modal.style.display = 'none';
    modalVideo.src = ""; // Clearing the source automatically stops the YouTube video
}

closeModal.addEventListener('click', closePopup);

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closePopup();
    }
});

// ==========================================
// 5. LIKES, DISLIKES, AND ANALYTICS
// ==========================================
async function recordAnalytics(actionType, explicitTitle = null) {
    try {
        const titleToUse = explicitTitle || modaltitle.innerText;
        
        const response = await fetch('/api/interactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                movieTitle: titleToUse,
                action: actionType
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save analytics');
        }
    }
    catch (error) {
        console.error('Error recording analytics:', error);
    }
}

likeBtn.addEventListener('click', () => {
    likes++;
    likeCount.innerText = likes;
    recordAnalytics('like');
});

dislikeBtn.addEventListener('click', () => {
    dislikes++;
    dislikeCount.innerText = dislikes;
    recordAnalytics('dislike');
});

// ==========================================
// 6. ADD MOVIE EDITOR LOGIC
// ==========================================
if (submitMovieBtn) {
    submitMovieBtn.addEventListener('click', async () => {
        const title = document.getElementById('newTitle').value;
        let posterUrl = document.getElementById('newPoster').value;
        const desc = document.getElementById('newDesc').value;
        const videoUrl = document.getElementById('newVideo').value;

    const ytThumbnail = getYouTubeThumbnail(videoUrl);
        if (!posterUrl && ytThumbnail) {
            posterUrl = ytThumbnail;
        }

        if (!title || !posterUrl || !videoUrl) {
            return alert("Please fill in the Title and Video fields! (Poster is required if not using YouTube)");
        }

        try {
            const response = await fetch('/api/movies', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'user-role': userRole 
                },
                body: JSON.stringify({ 
                    title: title, 
                    posterUrl: posterUrl, 
                    description: desc, 
                    videoUrl: videoUrl 
                })
            });

            if (response.ok) {
                alert("Movie Added Successfully!");
                // Clear the input boxes
                document.getElementById('newTitle').value = ''; 
                document.getElementById('newPoster').value = '';
                document.getElementById('newDesc').value = ''; 
                document.getElementById('newVideo').value = '';
                
                loadGallery(); // Instantly refresh the screen to show the new movie
            } else {
                const data = await response.json();
                alert(data.message || "Action Rejected: You are not an Editor.");
            }
        } catch (error) {
            console.error("Error saving movie:", error);
        }
    });
}

// ==========================================
// COMMENTS LOGIC (INTERACTIONS DATABASE)
// ==========================================

// Function to pull comments from the Interactions database
async function loadComments(movieTitle) {
    if (!commentSection) return;
    commentSection.innerHTML = ''; 
    
    try {
        // Updated URL to point to interactions
        const response = await fetch(`/api/interactions/comments/${encodeURIComponent(movieTitle)}`);
        if (response.ok) {
            const comments = await response.json();
            
            if (comments.length === 0) {
                commentSection.innerHTML = '<p style="color: #aaa; font-style: italic;">No comments yet.</p>';
                return;
            }

            comments.forEach(c => {
                const p = document.createElement('p');
                p.innerText = c.commentText; // Pulls from the new commentText field
                p.style.borderBottom = "1px solid #555";
                p.style.paddingBottom = "5px";
                p.style.margin = "5px 0";
                commentSection.appendChild(p);
            });
        }
    } catch (error) {
        console.error("Error loading comments:", error);
    }
}

// Logic for the "Post" button
if (addCommentBtn) {
    addCommentBtn.addEventListener('click', async () => {
        const text = commentInput.value;
        if (!text) return alert("Please write a comment first!");

        const currentMovie = modaltitle.innerText; 

        try {
            // Updated URL to point to interactions
            const response = await fetch('/api/interactions/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-role': userRole 
                },
                body: JSON.stringify({
                    movieTitle: currentMovie,
                    commentText: text
                })
            });

            if (response.ok) {
                commentInput.value = ''; 
                loadComments(currentMovie); 
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    });
}

// ==========================================
// 7. INITIALIZE PAGE
// ==========================================
// Build the gallery as soon as the page loads!
loadGallery();