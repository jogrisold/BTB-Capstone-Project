import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

// React icon to toggle search
import { FcSearch } from "react-icons/fc";
import { UserContext } from "./UserContext";

const NavSearch = ({bikeStations, addRouteLayer, removeMarkers, centerMapOnOrigin}) => {

    // To hold the data that will be fetched from the mapbox directions API
    // returning the directions from origin to destination
    const [directions, setDirections] = useState({});
    let distanceArray = []

    // State for origin and destination input by user in the form
    const [originInput, setOriginInput] = useState("6327 St Laurent Blvd, Montreal, Quebec  H2S 3C3")
    const [destinationInput, setDestinationInput] = useState("275 Notre-Dame St. East, Montreal, Quebec H2Y 1C6")

    // State to handle our function calls based on whether the opencage fetch
    // has successfully returned our input as geoJSON array format
    const [geoJSONfetch, setGeoJSONfetch] = useState(false)

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
        setPublicTransitResult
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
    const nearestStationCalc = (location) => {
        bikeStations.map((station)=> {
            distanceArray = [...distanceArray, {"station_id": station.station_id , "position": station.position, "distance": getDistance(location, station.position)}]
            return distanceArray 
        })
        // Sort the array to find the lowest distance
        distanceArray.sort((a, b)=>{
            return a.distance-b.distance;
        })
        return distanceArray[0].position
    }

    // Then once the stations have been chosen, we need to get the directions
    const getBikeDirections = (e) => {
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
        // Request route layers for the locations retrieved
        
        // addRouteLayerRequest();
        // Hide the form so the user can see their route
        // setSearch(false);
        // console.log(busDuration);
        console.log("getDirections end")

    }

    // Create a function that will fetch public transit option from the NEXT public transit api
    // so that we can compare it against the bike route
    const fetchPublictTransitDirections = () => {

        const transitAPIkey = 'nhtKpzL7jDCdppdqSI2G4sIeQukduxhH74b-6xPcCV8'
        const test = "45.530210"
        // fetch(`https://router.hereapi.com/v8/routes?destination=-15.79931,-47.86015&origin=-15.8697718,-47.9738754&return=summary&transportMode=bus&apiKey=${transitAPIkey}`)
        // fetch(`https://transit.hereapi.com/v8/stations?in=45.538980,-73.631142&apiKey=nhtKpzL7jDCdppdqSI2G4sIeQukduxhH74b-6xPcCV8`)
        // Note that the HERE api uses non-geoJSON format for it's latitude, longitude
        fetch(`https://transit.router.hereapi.com/v8/routes?origin=${origin[1]},${origin[0]}&destination=${destination[1]},${destination[0]}&apiKey=nhtKpzL7jDCdppdqSI2G4sIeQukduxhH74b-6xPcCV8`)
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data)
                // if(data.notices[0].code == "noCoverage"){
                //     window.alert("Could not find a public transit route for these co-ordinates")
                // } else {
                    setPublicTransitResult(data);
                // }
                // setBusDuration(data.routes[0].sections[0].summary.duration/60)
            })

        // fetch(`https://router.hereapi.com/v8/routes?destination=-15.79931,-47.86015&origin=-15.8697718,-47.9738754&return=summary&transportMode=bus&apiKey=${transitAPIkey}`)
        fetch(`https://router.hereapi.com/v8/routes?destination=45.538980,-73.631142&origin=45.530210,-73.608370&return=summary&transportMode=bus&apiKey=nhtKpzL7jDCdppdqSI2G4sIeQukduxhH74b-6xPcCV8`)
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data)
                // setTest(data.routes[0].sections[0].summary.duration/60);
            })
    }

    // Create a function that will send route fetch requests in Map
    // const addRouteLayerRequest = () =>{
    useEffect(()=>{
        if (geoJSONfetch){
            
            // Calculate the nearest station for origin
            let originStation = nearestStationCalc(origin);
            // Calculate the nearest station for destination
            let destinationStation = nearestStationCalc(destination);
            
            // Check the bus route duration
            fetchPublictTransitDirections();

            // Clear the routesData Array of the previous trip
            setRoutesData([]);
            // 1. Request the walking directions to the originStation
            addRouteLayer(origin, originStation, 'walk-to-station', '#BFCCFF', 'walking', false);
            // 2. Request the biking directions from originStation to destinationStation
            addRouteLayer(originStation, destinationStation, 'bike-between-stations', '#5D5B67', 'cycling', true);
            // 3. Request the walking directions from the closest station to the destination (destinationStation)
            addRouteLayer(destinationStation, destination, 'walk-from-station', '#BFCCFF', 'walking', false);
            // 4. Remove the other stations from the map
            removeMarkers()
            // 5. Center the map at the start of the route
            centerMapOnOrigin()
            console.log("addRouteLayer request end")
            // Reset the state to avoid additional calculation on re render
            setGeoJSONfetch(false)
        }
    },[geoJSONfetch])



    
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
            ?   <GetDirectionsForm 
                    onSubmit={getBikeDirections}>
                
                <Label htmlFor='origin'>Origin</Label>
                    <Input
                        autoFocus
                        type="text"
                        placeholder="Origin"
                        // value={"6327 St Laurent Blvd, Montreal, Quebec  H2S 3C3"}
                        value={originInput}
                        required={true}
                        onChange={(e) => {setOriginInput(e.target.value)}}
                    />
                    <Label htmlFor='last-name'>Destination</Label>
                    <Input
                        type="text"
                        placeholder="Destination"
                        // value={"275 Notre-Dame St. East, Montreal, Quebec H2Y 1C"}
                        value={destinationInput}
                        required={true}
                        defaultValue={"test"}
                        onChange={(e) => {setDestinationInput(e.target.value)}}
                    />
                    <GetDirectionsSubmit type="submit">Let's Go!</GetDirectionsSubmit>
                </GetDirectionsForm>
            : <></>
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
`;
// Same for inpiut
const Input = styled.input`
    font-size: 24px;
    width: 100%;
    height: 40px;
    border-radius: 5px;
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