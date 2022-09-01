"use strict";

// Require MongoDB and dotenv
const { MongoClient } = require("mongodb");
require("dotenv").config();


// Mongo constants
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Unique ID creation for each data point
const { v4: uuidv4 } = require("uuid");

// Hash conversion to encrypt user passwords
const bcrypt = require("bcrypt");

// Create a handler to return user data from the database on login
const handleLogIn = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("BTB");
  let user = null;

  try {
    await client.connect();
    console.log("login")
    console.log(req.body)
    user = await db.collection("users").findOne({ email: req.body.email });

    if (user) {
      // Check if the database encrypted password matches the login
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.status(200).json({
          status: 200,
          data: user,
          message: "Log in success",
        });
      } else {
        res.status(404).json({
          status: 404,
          data: req.body,
          message: "Invalid Password",
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        data: req.body,
        message: "No account found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      data: req.body,
      message: err.message,
    });
  }
  client.close();
};

// Create a handler to add new user data to database when a user 
// submits a sign up request
const handleSignUp = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("BTB");
  let user = null;
  try {
    await client.connect();
    console.log("sign up")
    console.log(req.body)
    user = await db.collection("users").findOne({ email: req.body.email });
    // Check if the entered email already exists in the database
    if (!user) {
      req.body._id = uuidv4();
      // Encrypt the user password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
      // Add the new user, including an encrypted password that will
      // not be decryptable if intercepted
      const userInserted = await db.collection("users").insertOne(req.body);
      if (userInserted) {
        res.status(200).json({
          status: 200,
          data: req.body,
        });
      } else {
        res.status(404).json({
          status: 404,
          data: req.body,
          message: "Sign up request failed",
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        data: req.body,
        message: "That email already exists",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      data: req.body,
      message: err.message,
    });
  }
  client.close();
};

module.exports = {
  handleLogIn,
  handleSignUp,
};