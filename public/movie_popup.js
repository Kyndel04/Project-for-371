const modal = document.getElementById('movieModal');
        const closeModal = document.getElementById('closeModal');
        const modaltitle = document.getElementById('modal-title');
        const modalVideo = document.getElementById('modalVideo');
        const modalDescription = document.getElementById('modalDescription');
        
        const likeBtn = document.getElementById('likeBtn');
        const dislikeBtn = document.getElementById('dislikeBtn');
        const likeCount = document.getElementById('likeCount');
        const dislikeCount = document.getElementById('dislikeCount');

        let likes = 0;
        let dislikes = 0;
        let views =0

        const posters = document.querySelectorAll('.movie-poster');
        posters.forEach(poster => {
            poster.addEventListener('click', async function () {
                const title = this.getAttribute('data-title');

                modaltitle.innerText = this.getAttribute('data-title');
                modalDescription.innerText = this.getAttribute('data-description');
                
                // Set the video source to the local file
                modalVideo.src = this.getAttribute('data-video');

                try {
                    const response = await fetch(`/api/interactions/${encodeURIComponent(title)}`);
                    if (response.ok) {
                        const data = await response.json();
                        likes = data.likes;       // Use the database numbers
                        dislikes = data.dislikes; 
                    } else {
                        likes = 0; dislikes = 0;  // Fallback to 0 if movie has no history
                    }
                }
                catch (error) {
                    console.error("Error loading previous counts", error);
                    likes = 0; dislikes = 0;
                }
                
                likeCount.innerText = likes;
                dislikeCount.innerText = dislikes;

                modal.style.display = 'block';
            });
        });

        function closePopup() {
            modal.style.display = 'none';
            modalVideo.pause(); // Stop playing the local video
            modalVideo.src = ""; // Clear the source
        }

        closeModal.addEventListener('click', closePopup);

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closePopup();
            }
        });

        async function recordAnalytics(actionType) {
            try {
                const response = await fetch('/api/interactions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        movieTitle: modaltitle.innerText,
                        action: actionType
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to save analytics');
                }

                const result = await response.json();
                console.log(result.message);
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