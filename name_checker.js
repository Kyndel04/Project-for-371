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