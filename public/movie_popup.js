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

        const posters = document.querySelectorAll('.movie-poster');
        posters.forEach(poster => {
            poster.addEventListener('click', function() {
                modaltitle.innerText = this.getAttribute('data-title');
                modalDescription.innerText = this.getAttribute('data-description');
                
                // Set the video source to the local file
                modalVideo.src = this.getAttribute('data-video');
                
                likes = 0; dislikes = 0;
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

        likeBtn.addEventListener('click', () => {
            likes++;
            likeCount.innerText = likes;
        });

        dislikeBtn.addEventListener('click', () => {
            dislikes++;
            dislikeCount.innerText = dislikes;
        });