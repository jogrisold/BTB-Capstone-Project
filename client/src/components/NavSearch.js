import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

// React icon to toggle search
import { FcSearch } from "react-icons/fc";
import { UserContext } from "./UserContext";

const NavSearch = ({ addRouteLayer, removeMarkers, centerMapOnOrigin}) => {

    // To hold the data that will be fetched from the mapbox directions API
    // returning the directions from origin to destination
    const [directions, setDirections] = useState({});

    // State for origin and destination input by user in the form
    const [originInput, setOriginInput] = useState("6327 St Laurent Blvd, Montreal, Quebec  H2S 3C3")
    const [destinationInput, setDestinationInput] = useState("275 Notre-Dame St. East, Montreal, Quebec H2Y 1C6")
    

    // State to handle our function calls based on whether the opencage fetch
    // has successfully returned our input as geoJSON array format
    const [geoJSONfetch, setGeoJSONfetch] = useState(false)

    // Initialize arrays to hold the lng, lat of transit stations in the 
    let originTransitStation = [];
    let destinationTransitStation = [];

    const YOUR_API_KEY = "HERE-4d73a56f-1184-4598-9fd6-fa7142a57fe0";
    // Use context to access states initialized in UserContext
    // search, SetSearch: for conditional rendering of the search form
    const {
        search, 
        setSearch,
        isLoggedIn,
        setIsLoggedIn,
        origin,
        setOrigin,
        destination,
        setDestination,
        routesData, 
        setRoutesData,
        tripDetails,
        setTripDetails,
        busDuration, 
        setBusDuration,
        publicTransitResult, 
        setPublicTransitResult,
        setStationStatus,
        bikeStations, 
        setBikeStations,
        setAddStations,
        userData,
        currentUser
    } = useContext(UserContext);

    
    // Create a function that will toggle the view of the search form
    const toggleSearch = () => {
        if (search === true){
            setSearch(false);   
        } else {
            setSearch(true);
        }
    }


    // Function to calculate the distance between two points
    const getDistance = (start, finish) => {
        // Calculate the euclidian distance between two points: 
        // d = √[(x2 – x1)2 + (y2 – y1)2].
        // We could use the haversine method, but for the purposes of micromobility,
        // the accuracy is less than a magnitude of order of error
        const distEucl = Math.sqrt(
            // Keeping in mind that our location data is in geojson format of
            // an array e.g. geojsondatapoint = [longitude, latidute] 
            Math.pow(start[1] - finish[1], 2) + Math.pow(start[0] - finish[0], 2)
            );
        const distKm = distEucl * 11.1
        return distKm
    };

    // First we will need to run getDistance on the station data to find the closest one
    const nearestStationCalc = (location, type) => {
        // Initialize an array to hold the distance to each station 
        let distanceArray = [];
        // Map through the stations retrieved in the bike station fetch in Map
        bikeStations.map((station)=> {
            // Run the get distance function on, but only if it has bikes for an origin station
            if (type == 'origin' && station.bikes == 0 && station.e_bikes == 0){
                return distanceArray 
            // And only if it has docks for a destination station
            } else if(type == 'destination' && station.docks == 0) {
                return distanceArray
            // Thus if it meets our requirements, add it to the array
            } else {
                distanceArray = [...distanceArray, {"station_id": station.station_id , "position": station.position, "distance": getDistance(location, station.position)}]
                return distanceArray 
            }
        })
        // Sort the array of objects to find the lowest distance
        distanceArray.sort((a, b)=>{
            return a.distance-b.distance;
        })
        return distanceArray[0].position
    }

    // Then once the stations have been chosen, we need to get the directions
    const geoJSONconverter = (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        // Convert the input strings to a format that can be passed as a param
        const fetchOrigin = JSON.stringify(originInput.replaceAll(" ", "&"));
        const fetchDestination = JSON.stringify(destinationInput.replaceAll(" ", "&"));
        
        // Fetch the opencage .get endpoint to convert string input into a geoJSON array
        fetch(`/get-position/${fetchOrigin}`)
            .then((res) => res.json())
            .then((data) => {
                setOrigin(data.data)
                // Nest the destination fetch in order to setGeoJSONfetch stat
                // only once both fetches have passed
                fetch(`/get-position/${fetchDestination}`)
                .then((res) => res.json())
                .then((data) => {
                    setDestination(data.data);
                    // Set a state to trigger the addRouteLayer function
                    // as the origin and destination states will not be 
                    // accessible immediately inside this function
                    setGeoJSONfetch(true);
                });
            });

        // If the user is logged in, add the route to the user profile
        if(currentUser !== null){
            console.log(currentUser)
            const route = {
                origin: originInput,
                destination: destinationInput
              };
            const addRoute = {
                _id : currentUser._id,
                route : route
            }
              fetch("/api/add-route-to-profile", {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addRoute),
              })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                });

        }
        


        // Hide the form so the user can see their route
        setSearch(false);
        // Add the markers for stations in case this is a second trip request
        setAddStations(true);
        console.log("getDirections end")
    }

    // Create a function that will fetch public transit option from the NEXT public transit api
    // so that we can compare it against the bike route
    const fetchPublictTransitDirections = () => {
        // const transitAPIkey = 'nhtKpzL7jDCdppdqSI2G4sIeQukduxhH74b-6xPcCV8'
        // Send a GET request to the HERE transit api at /routes, which will return the public transit details
        fetch(`https://transit.router.hereapi.com/v8/routes?origin=${origin[1]},${origin[0]}&destination=${destination[1]},${destination[0]}&apiKey=nhtKpzL7jDCdppdqSI2G4sIeQukduxhH74b-6xPcCV8`)
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data)
                setPublicTransitResult(data);
            })
            .catch((err) => window.alert(err))

        // Other potential: 
        // fetch(`https://router.hereapi.com/v8/routes?destination=45.538980,-73.631142&origin=45.530210,-73.608370&return=summary&transportMode=bus&apiKey=nhtKpzL7jDCdppdqSI2G4sIeQukduxhH74b-6xPcCV8`)
    }

    // Create a function that will send route fetch requests in Map
    // const addRouteLayerRequest = () =>{
    useEffect(()=>{
        if (geoJSONfetch){
            // Get our public transit directions
            fetchPublictTransitDirections();
            // Reset the state to avoid additional calculation on re render
            setGeoJSONfetch(false)
        }
    },[geoJSONfetch])

    // Create a use effect that will add the biking and transit routes
    // to the map once the geoJSONconverter has returned origin and destination
    // in the required format and the Publictransit directions use effect
    // has returned the PublicTransitResult
    useEffect(()=>{
        // Check that the Public transit result has been set, which by 
        // definition will mean that our geoJSON conversion was successful
        if (publicTransitResult !== null){
            // BIKING:
            // First, calculate the nearest station for origin and destination
            let originStation = nearestStationCalc(origin, 'origin');
            let destinationStation = nearestStationCalc(destination, 'destination');
            // Clear the route data from any previous trips
            setRoutesData([]);
            
            // 1. Request the walking directions to the originStation
            addRouteLayer(origin, originStation, 'walk-to-station', '#FADBD8', 'walking', 'biketrip', false);
            // 2. Request the biking directions from originStation to destinationStation
            addRouteLayer(originStation, destinationStation, 'bike-between-stations', '#F39C12', 'cycling', 'biketrip', true);
            // 3. Request the walking directions from the closest station to the destination (destinationStation)
            addRouteLayer(destinationStation, destination, 'walk-from-station', '#FADBD8', 'walking', 'biketrip', false);
            // 4. Remove the other stations from the map
            removeMarkers(originStation, destinationStation);
            // 5. Center the map at the start of the route
            centerMapOnOrigin();

            
            // Check that the fetch has not returned an empty array, which 
            // will be the case for all results out of mapping range
            if(publicTransitResult.routes.length >= 1){
                publicTransitResult.routes[0].sections.forEach(element => {
                    console.log(element);
                    if(element.type === 'transit'){
                        console.log(element.departure);
                        originTransitStation = [element.departure.place.location.lng, element.departure.place.location.lat];
                        destinationTransitStation = [element.arrival.place.location.lng, element.arrival.place.location.lat];
                    }
                });
                console.log(originTransitStation);
                // Transit layers:
                // 1. Request the walking directions to the departure transit station
                addRouteLayer(origin, originTransitStation, 'walk-to-bus-station', '#D4E6F1', 'walking', 'transittrip', false);
                // 2. Request the driving directions for the bus route
                //      !!!  need to handle metro routes                   !!!
                addRouteLayer(originTransitStation, destinationTransitStation, 'bus-between-stations', '#5499C7 ', 'driving', 'transittrip', true);
                // 3. Request the walking directions from the arrival transit station to final destination
                addRouteLayer(destinationTransitStation, destination, 'walk-from-bus-station', '#D4E6F1', 'walking', 'transittrip', false); 
            } else {
                // setErrorMessage();
                // setPopUp(true);
            }
        }
    },[publicTransitResult])
    
    return (
        <>
        <ToggleSearch
            onClick={toggleSearch}>
            <GetDirectionsText>
                <FcSearch  size = {50}/>
            </GetDirectionsText>
            <GetDirectionsText>Where to?</GetDirectionsText>
        </ToggleSearch>
        
        {search 
            ?   // If the user clicks on the search button, display the search form
            // If the user is logged in, set the origin and destination to home to work
                <GetDirectionsForm 
                    onSubmit={geoJSONconverter}>
                <Label htmlFor='origin'>Origin</Label>
                    <Input
                        autoFocus
                        type="text"
                        placeholder="Origin"
                        value={originInput}
                        required={true}
                        onChange={(e) => {setOriginInput(e.target.value)}}
                    />
                    <Label htmlFor='last-name'>Destination</Label>
                    <Input
                        type="text"
                        placeholder="Destination"
                        value={destinationInput}
                        required={true}
                        defaultValue={"test"}
                        onChange={(e) => {setDestinationInput(e.target.value)}}
                    />
                    <GetDirectionsSubmit type="submit">Let's Go!</GetDirectionsSubmit>
                </GetDirectionsForm>

            : // Otherwise, don't display anything
            <></>
        }
        </>
    )
}

export default NavSearch;
// Button to toggle getDirectionsForm search 
const ToggleSearch = styled.button`
    display: flex;
    justify-content: left;
    width: 100%;
    font-family: var(--font-heading);
    font-weight: bold;
    color: var(--color-quarternary);
    background-color: whitesmoke;
    font-size: 24px;
    border-radius: 5px;
    border: none;
`
// Styling fo the header
const GetDirectionsText = styled.div`
    color: var(--color-secondary);
    font-size: 38px;
    font-weight: 600;
    font-family: var(--font-heading);
    margin: 10px 0 0 25px;
`;

// Create our form
const GetDirectionsForm = styled.form`
    position: absolute;
        z-index: 5;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

// Create our label styling
const Label = styled.label`
    font-size: 1rem;
    color: var(--color-secondary);
    background-color: white;
    text-align: left;
    font-size: 24px;
    width: 100%;
    padding: 5px 0 5px 0;
`;
// Same for inpiut
const Input = styled.input`
    font-size: 16px;
    width: 100%;
    height: 40px;
    border: none;
`;
// Button for form submission
const GetDirectionsSubmit = styled.button`
  font-family: var(--font-heading);
  font-weight: bold;
  color: var(--color-quarternary);
  background-color: whitesmoke;
  font-size: 24px;
  border-radius: 5px;
  border: none;
  padding: 10px;
  cursor: pointer;
    transition: ease-in-out 100ms;
    &:hover{
      transform: scale(1.02);
    }
    &:active{
        transform: scale(.8);
        background-color: lightgray;
    }
`