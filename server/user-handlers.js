//*************************************************************** */
"use strict";
//*************************************************************** */
// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
require("dotenv").config();

// Utility to reduce (200) status: 200 fatigue
const { sendResponse } = require("./utils");

// MongoDB constants
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const { MONGO_URI } = process.env;


//*************************************************************** */
// SERVER HANDLERS
//*************************************************************** */


const getFlights = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    // Connect to client
    await client.connect();
    // Fetch all flights from mongoDB
    const db = client.db("SlingAir");
    const flightsDB = await db.collection("flights").find().toArray();
    // Input handling
    let flightNumbers = [];
    Object.values(flightsDB).map((value)=>{
      return flightNumbers = [...flightNumbers, value.flight]
    })
    if(flightNumbers.length > 0){
      sendResponse(res, 200, flightNumbers, "Flight Numbers are: ");
    } else {
      sendResponse(res, 500, flightNumbers, "Nothing retrieved from mongoDB");
    }
  } catch (err) {
    console.log("Failed to retrieve flights from database: ", err);
    sendResponse(res, 500, flightNumbers, err.message);
  }
  client.close();
};


//*************************************************************** */
// Export our handlers
//*************************************************************** */
module.exports = {
  getFlights
};
//*************************************************************** */