// src/api/auth.js

import axios from "axios";

// Define the base URL for the API requests
const loginApiUrl = "http://localhost:8080/api/v1/bankapplication/login";


// Create a function to handle the login API request
const loginUser = async (email:string, password:string) => {
    try {
        const response = await axios.post(loginApiUrl, {
            email,
            password
        });
        return response;  // Return the response to be used in the component
    } catch (error) {
        throw error;  // Propagate any error for the component to handle
    }
};

export default loginUser;