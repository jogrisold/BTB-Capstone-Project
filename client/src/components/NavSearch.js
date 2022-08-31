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
    } = useContext(UserContext);

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
    const getDirections = (e) => {
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
        addRouteLayerRequest();
    }

    // Create a function that will send route fetch requests in Map
    const addRouteLayerRequest = () =>{
        if (geoJSONfetch){
            // Calculate the nearest station for origin
            let originStation = nearestStationCalc(origin);
            // Calculate the nearest station for destination
            let destinationStation = nearestStationCalc(destination);
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
        }
    }

    if (directions.routes !== undefined){
        console.log('directions.routes: '+ directions.routes[0].distance)
    }

    const toggleSearch = () => {
        if (search === true){
            setSearch(false);
        } else {
            setSearch(true);
        }
    }
    
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
                    onSubmit={getDirections}>
                
                <Label htmlFor='origin'>Origin</Label>
                    <Input
                        autoFocus
                        type="text"
                        placeholder="Origin"
                        // value={"6327 St Laurent Blvd, Montreal, Quebec  H2S 3C3"}
                        value={originInput}
                        required={true}
                        onChange={(e) => {
                            console.log(e.target.value)
                            setOriginInput(e.target.value)
                            console.log(originInput)
                            }
                        }
                    />
                    <Label htmlFor='last-name'>Destination</Label>
                    <Input
                        type="text"
                        placeholder="Destination"
                        // value={"275 Notre-Dame St. East, Montreal, Quebec H2Y 1C"}
                        value={destinationInput}
                        required={true}
                        defaultValue={"test"}
                        onChange={(e) => {
                            console.log(e.target.value)
                            setDestinationInput(e.target.value)
                            console.log(destinationInput)
                            }
                        }
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
        top: 100;
        left: 100;
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