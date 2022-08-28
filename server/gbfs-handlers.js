//*************************************************************** */
"use strict";
//*************************************************************** */

// Require the request-promise package
const request = require('request-promise');
// const rp = require('request-promise')

require("dotenv").config();

// Utility to reduce (200) status: 200 fatigue
const { sendResponse } = require("./utils");

const requestGBFS = () => {
  return new Promise (resolve => {
    request("https://gbfs.velobixi.com/gbfs/en/station_information.json")
      .then((response) => {
        const parsedResponse= JSON.parse(response);
        return parsedResponse;
      })
      .then((parsedResponse) => {
        // Initialize an array to hold the lat/long of all stations
        let locations = [];
        let stationLocation = [];
        // Map through the stations array within the data object and
        // return the lat and long of each station, along with the 
        // station id to use in looking up the station's data in station_status
        parsedResponse.data.stations.map((station) =>{
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
    return res
      .status(200)
      .json({
        status: 200,
        data: response,
        message: "Bike station data retreived",
    });
    // sendResponse(res, 200, response, "Bike stations loaded");
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({status: 500, data: "nope!", message: "It's a 500 error in getGBFS, oh no!",});
  }
};

// const profile = "mapbox/driving-traffic"
// // const coordinates = {{-73.554138, 45.508820},{-73.607000, 45.529730}}

// "pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug"
// const testurl = "-73.554138%2C45.508820%3B-73.607000%2C45.529730&access_token=pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug"
// const testurlsimple = "https://api.mapbox.com/directions/v5/mapbox/cycling/-73.607%2C45.52973%3B-73.554138%2C45.50882?alternatives=false&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug"
// const parsedUrl = JSON.parse(testurlsimple);
// town hall: [-73.554138, 45.508820]
// my house: [-73.607000, 45.529730]
// Sample request
// "https://api.mapbox.com/directions/v5/mapbox/
// cycling/
// -73.607
// %2C
// 45.52973
// %3B
// -73.554138
// %2C
// 45.50882
// ?alternatives=true
// &annotations=speed
// %2C
// congestion
// %2C
// duration
// %2C
// distance
// &continue_straight=true
// &geometries=geojson
// &language=en
// &overview=full
// &steps=true
// &acce

// const requestRoute = () => {
//   return new Promise ((resolve, reject) => {
//     console.log("promise start");
//     request(`https://api.mapbox.com/directions/v5/driving/-73.554138,45.508820;-73.607000,45.529730`)
//      .then((response) => {
//         const parsedResponse= JSON.parse(response);
//         console.log(`parsedResponse is ${parsedResponse}`);
//         return parsedResponse;
//       })
//       .then((parsedRespsonse) => {
//       console.log(`parsedResponse is ${parsedResponse}`);
//       const distance = parsedRespsonse.waypoints.distance;
//       return distance;
//       })
//       if (distance === undefined){
//         reject("Rejected!")
//       }
//      return resolve(distance);
//   })
// }

// Create a function that will retrieve the route data from
// mapbox directions API. Note: this is a paid service, but
// only after 100,000 requests per month, so for the purposes
// of the Capstone project, it will be free.
// const getRoute= async (req, res) => {
//   try{
//     const response = await requestRoute();
//     console.log(response);
//     return response;
//     // res
//     //     .status(200)
//     //     .json({
//     //       status: 200,
//     //       data: response,
//     //       message: "Works without utils",
//     //   });
//   } catch (err){
//     console.log(`500 error or something, I don't know`)
//     // res.status(500).json({status: 500, data: err, message: "It's a 500 error in getRoute, oh no!"});
//     // sendResponse(res, 500, err, "It's a 500 error, oh no!");
//   }
//     // lookup nodejs-promises: exercise-3.4
// }
// console.log(getRoute());

// const getDistanceFromGBFS = async (req, res) => {
//   try{
//     sendResponse(res, 200, "test");
//   } catch (err){
//     sendResponse(res, 500, "data goes here", err.message);
//   }
//     // lookup nodejs-promises: exercise-3.4
// }

//*************************************************************** */
// Export our handlers
//*************************************************************** */
module.exports = {
    getGBFS
};
//*************************************************************** */