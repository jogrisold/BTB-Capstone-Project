//*************************************************************** */
"use strict";
//*************************************************************** */

// Require the request-promise package
const request = require('request-promise');

// Utility to reduce (200) status: 200 fatigue
const { sendResponse } = require("./utils");

const requestGBFS = (URI) => {
  return new Promise (resolve => {
    request("https://gbfs.velobixi.com/gbfs/en/station_information.json")
      .then((response) => {
        const parsedRepsonse= JSON.parse(response);
        return parsedRepsonse;
      })
      .then((parsedRepsonse) => {
       
        // Initialize an array to hold the lat/long of all stations
        let locations = [];
        let stationLocation = [];
        // Map through the stations array within the data object and
        // return the lat and long of each station, along with the 
        // station id to use in looking up the station's data in station_status
        parsedRepsonse.data.stations.map((station) =>{

            // Retrieve our desired data
            stationLocation =
            {   station_id: station.station_id,
                name: station.name,
                position: [station.lon, station.lat],
                capacity: station.capacity
              }
             
            // Add it to the locationsarray via a spread operator
            return locations = [ ...locations, stationLocation]

        })
        resolve(locations);
      })
  })
}



const getGBFS = async (req,res) => {
  try {
    const response = await requestGBFS();
    // sendResponse(res, 200, response, "Bike stations loaded");
    sendResponse(res, 100, "test", "test")
  } catch (err) {
    console.log('Error: ', err.message);
  }
};


// Create a function that will retrieve the closest station
const getDistanceFromGBFS = async (req, res) => {
  try{

    sendResponse(res, 200, "test");
  } catch (err){
    sendResponse(res, 500, "test failed");
  }
    // lookup nodejs-promises: exercise-3.4
}

//*************************************************************** */
// Export our handlers
//*************************************************************** */
module.exports = {
    getGBFS,
    getDistanceFromGBFS
};
//*************************************************************** */