import { useContext, useState } from "react";
import styled from "styled-components";

// React icon to toggle search
import { FcSearch } from "react-icons/fc";
import { UserContext } from "./UserContext";

const NavSearch = ({bikeStations, addRouteLayer, removeMarkers, centerMapOnOrigin}) => {

    // To hold the data that will be fetched from the mapbox directions API
    // returning the directions from origin to destination
    const [directions, setDirections] = useState({});
    let distanceArray = []

    // State for origin and destionation
    const [originInput, setOriginInput] = useState([-73.607000, 45.529730])
    const [destinationInput, setDestinationInput] = useState([-73.507000, 45.429730])

    // Use context to access states initialized in UserContext
    // search, SetSearch: for conditional rendering of the search form
    const {
        search, 
        setSearch
    } = useContext(UserContext);

    // Function to calculate the distance between two points
    const getDistance = (origin, destination) => {

        
        // Calculate the euclidian distance between two points: 
        // d = √[(x2 – x1)2 + (y2 – y1)2].
        // We could use the haversine method, but for the purposes of micromobility,
        // the accuracy is less than a magnitude of order of error
        const distEucl = Math.sqrt(
            // Keeping in mind that our location data is in geojson format of
            // an array e.g. geojsondatapoint = [longitude, latidute] 
            Math.pow(origin[1] - destination[1], 2) + Math.pow(origin[0] - destination[0], 2)
            );

        const distKm = distEucl * 11.1
        return distKm
    };

    // First we will need to run getDistance on the station data to find the closest one

    const nearestStationCalc = () => {
        const testAddress = [-73.607000, 45.529730]
        bikeStations.map((station)=> {
            let distCalc = getDistance(testAddress, station.position)
            distanceArray = [...distanceArray, {"station_id": station.station_id , "distance": getDistance(testAddress, station.position)}]
            return distanceArray = [...distanceArray, getDistance(testAddress, station.position)]
        })
        // sort the array to find the lowest distance
        distanceArray.sort((a, b)=>{
            return a-b;
        })
        return distanceArray
    }
    // Then we will need to do the same for the destination address
    nearestStationCalc();


    // Then once the stations have been chosen, we need to get the directions
    const getDirections = (e) => {
        e.preventDefault();
        // 0. (test) Total route directions
        fetch('https://api.mapbox.com/directions/v5/mapbox/driving/13.43,52.51;13.42,52.5;13.43,52.5?waypoints=0;2&access_token=pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug')
            .then((res)=>res.json())
            .then((data)=> {
                console.log('data is: ' + Object.keys(data))
                console.log('data is: ' + data.routes[0].distance)
                setDirections(data);
            })
        
        // test directions layer add
        
        addRouteLayer();
        

        // 1. Reqest the walking directions to the closest station (originStation)

        // 2. Request the biking directions from originStation to destinationStation

        // 3. Request the walking directions from the closest station to the destination (destinationStation)

        // 4. Remove the other stations from the map
        // Add bike stations

        // 112: bikestations triggered
        // Check that the station data has been retrieved successfully
        // in the fetch above, and that the map has been rendered
        removeMarkers();
        // Test origin and destination
        const origin =[-73.607000, 45.529730]; // this needs to be a setState
        const destination = [-73.507000, 45.429730]; // in order to update in Map
        centerMapOnOrigin(origin, destination);
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
                            value={originInput}
                            required={true}
                            onChange={(e) => setOriginInput(e.target.value)}
                        />
                        <Label htmlFor='last-name'>Destination</Label>
                        <Input
                            type="text"
                            placeholder="Destination"
                            value={destinationInput}
                            required={true}
                            onChange={(e) => setDestinationInput(e.target.value)}
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