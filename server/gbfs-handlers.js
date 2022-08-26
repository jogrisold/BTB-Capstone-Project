// Require the request-promise package
const request = require('request-promise');



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
        
        // Map through the stations array within the data object and
        // return the lat and long of each station, along with the 
        // station id to use in looking up the station's data in station_status
        parsedRepsonse.data.stations.map((station) =>{
            // Retrieve our desired data
            stationLocation =
            {   station_id: station.station_id,
                lat: station.lat,
                lng: station.lat,
              }
            // Add it to the locationsarray via a spread operator
            return locations = [ ...locations, stationLocation]

        })
        resolve(locations) ;
      })
  })
}

const getGBFS = async () => {
  try {
    const response = await requestGBFS();
    return response;
  } catch (err) {
    console.log('Error: ', err);
  }
};
getGBFS().then((response) => console.log(response));

// Create a function that will retrieve the closest station
const getDistanceFromGBFS = () => {
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