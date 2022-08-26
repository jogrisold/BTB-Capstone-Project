// Import Express
const express = require("express");

// Call express to use for endpoints below
express()

    .get("/test", (req, res) => {
        res.status(200).json({status: 200, message: "success"})
    })

    // Create an endpoint to create a user in the database
    // .post("/add-user", createUser)

    // Create an endpoint to retrieve user data based on user ID

    // Create an endpoint to modify user information when user 
    // submits the preferences form in /profile


    // Basic backend functionality to set port
    .listen(8000, () => {
        console.log("Server listening on port 8000")
    });