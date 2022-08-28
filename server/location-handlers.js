// Require opencage - an open source api that allows for conversion of
// address to lng/lat position for use in mapbox
const opencage = require('opencage-api-client');
require('dotenv').config();
    
// Utility to reduce (200) status: 200 fatigue
const { sendResponse } = require("./utils");

// Define a function that will return the lat/lng based on client input
const getPositionFromAddress = (req, res) => {
const address = req.body.address
const requestObj = {
    key: 'ce27352538b74e3c83f2a77d96178a20',
    q: `${address}`,
};
  
return opencage
    .geocode({ q: requestObj.q, key: requestObj.key })
    .then((data) => {
        response = JSON.stringify(data);
        return response;
    })
    .then((response) => {
        parsedResponse = JSON.parse(response)
        return parsedResponse;
     })
     .then((parsedResponse)=>{
        const results = parsedResponse.results;
        const lat = results[0].geometry.lat;
        const lon = results[0].geometry.lat;

        // Return the position in the required geojson format
        return [lon, lat];
    })
  .catch((error) => {
        console.log('Error caught:', error.message);
    });
};

//*************************************************************** */
// Export our handlers
//*************************************************************** */
module.exports = {
  getPositionFromAddress
};
//*************************************************************** */