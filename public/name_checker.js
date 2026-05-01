function checkName() {
    const nameInput = document.getElementById("UserID");
    const name_value = nameInput.value;

    //test if the name contains invalid characters
    if (name_value.length > 0 && (name_value.length < 8 || name_value.length > 16)) {
        console.log("User ID must be between 8 and 16 characters.");
    }
    else {
        console.log("User ID length is valid.");
    }

}


//Validate the the passwords
async function validateForm(event) {
    event.preventDefault(); 

    const usernameInput = document.getElementById("UserID").value;
    const passwordInput = document.getElementById("password").value;

    // 1. Frontend Validation: User ID (8-16 characters)
    if (usernameInput.length < 8 || usernameInput.length > 16) {
        alert("User ID must be between 8 and 16 characters.");
        return false;
    }

    // 2. Frontend Validation: Password (Complexity Requirements)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,16}$/;
    
    if (!passwordRegex.test(passwordInput)) {
        alert("Password must be 8-16 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
        return false; // Stops the login process if the password doesn't meet the rules
    }

    // 3. Send the data to your Express backend
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: usernameInput, 
                password: passwordInput 
            })
        });

        // 4. Handle the server's response
        if (response.ok) {
            const data = await response.json();

            sessionStorage.setItem('userRole', data.role);

            alert("Login successful!");
            window.location.href = "Gallery.html"; // Redirects them to the movies
        } else {
            alert("Invalid User ID or Password.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Server error. Is your Node.js server running?");
    }
}


