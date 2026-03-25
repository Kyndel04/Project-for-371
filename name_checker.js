function check_name() {
    const nameInput = document.getElementById("UserID");
    const name_value = nameInput.value;

    // Regular expression that check for the letters in Alphabet upper and lower case
    const invalid_char_regex = /[^a-zA-Z]/g;

    //test if the name contains invalid characters
    if(invalid_char_regex.test(name_value)) {
        alert("Invalid name. Please use only alphabetic characters (A-Z, a-z).");
        
        //Just so there console message as well as an alert
        console.log("Name contains invalid characters.");

        //Remove invalid characters from the input field
        nameInput.value=name_value.replace(invalid_char_regex, "");
        return false;
    }
    else{
        console.log("Name is valid.");
        return true;
    }

}

async function hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function validateForm() {
    const nameInput = document.getElementById("password").value;
    
    //Regex that checks that passowrd has lowercase, uppercase letter, a nummber, a special char and if password meets the length
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {//alerts when password is not correct
        alert("Password must be 8-16 characters, include uppercase, lowercase, and a special character.");
        return false;
    }

    const hashedPassword = await hashPassword(password);
    console.log("Hashed password:", hashedPassword);
    return true;
}

