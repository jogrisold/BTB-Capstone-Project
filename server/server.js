// Import Express
const express = require("express");
const { getGBFS } = require("./gbfs-handlers");
const { requestPositionFromAddress } = require("./location-handlers");

// Call express to use for endpoints below
express()
    // Create an endpoint to request bike station data
    .get("/stations", getGBFS)

    // Create an endpoint that will return the lon/lat
    // based on a user address input in the form
    .get("/get-position/:address", requestPositionFromAddress)

    // Create an endpoint to create a user in the database
    // .post("/add-user", createUser)

    // Create an endpoint to retrieve user data based on user ID

    // Create an endpoint to modify user information when user 
    // submits the preferences form in /profile

    // Catch all endpoint
    .get("*", (req, res) => {
        res.status(404).json({
        status: 404,
        message: "Server endpoint does not exist",
        });
    })

    // Basic backend functionality to set port
    .listen(8000, () => {
        console.log("Server listening on port 8000")
    });