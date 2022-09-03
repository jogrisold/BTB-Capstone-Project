// Import Express
const express = require("express");
const bp = require('body-parser')
const { getGBFS, getStationStatus } = require("./gbfs-handlers");
const { requestPositionFromAddress } = require("./location-handlers");
const { handleLogIn, handleSignUp, updateUserProfile, getUserProfile } = require("./user-handlers");

// Call express to use for endpoints below
express()
    .use(bp.json())
    .use(bp.urlencoded({extended:true}))
    // Create an endpoint to request bike station data
    .get("/stations", getGBFS)
    .get("/station-status", getStationStatus)

    // Create an endpoint that will return the lon/lat
    // based on a user address input in the form
    .get("/get-position/:address", requestPositionFromAddress)

    // Create an endpoint to add a user in the database on sign up
    .post("/api/signup", handleSignUp)

    // Create an endpoint to retrieve user data based on user ID
    // when they sign in
    .post("/api/login", handleLogIn)

    // Create an endpoint to retrieve user data to store in state
    // based on user id
    .get("/api/users/:_id", getUserProfile)

    // Create an endpoint to modify user information when user 
    // submits the preferences form in /profile
    .patch("/api/update-profile", updateUserProfile)


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