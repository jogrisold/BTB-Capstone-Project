import { useState } from "react";
import styled from "styled-components";


const NavSearch = ({bikeStations, addRouteLayer}) => {

    // To hold the data that will be fetched from the mapbox directions API
    // returning the directions from origin to destination
    const [directions, setDirections] = useState({});
    let distanceArray = []

    // Function to calculate the distance between two points
    const getDistance = (origin, destination) => {

        // Keeping in mind that our location data is in geojson format of
        // geojsondatapoint = [longitude, latidute] 

        // Calculate the euclidian distance between two points: 
        // d = √[(x2 – x1)2 + (y2 – y1)2].
        // We could use the haversine method, but for the purposes of micromobility,
        // the accuracy is less than a magnitude of order of error
        const distEucl = Math.sqrt(
            Math.pow(origin[1] - destination[1], 2) + Math.pow(origin[0] - destination[0], 2)
            );

        const distKm = distEucl * 11.1
        return distKm
    };

    // First we will need to run getDistance on the station data to find the closest one

    const nearestOriginStation = () => {
        const testAddress = [-73.607000, 45.529730]
        bikeStations.map((station)=> {
            return distanceArray = [...distanceArray, getDistance(testAddress, station.position)]
        })
    }
    // Then we will need to do the same for the destination address
    nearestOriginStation();
    console.log(distanceArray)

    // Then once the stations have been chosen, we need to get the directions
    const getDirections = () => {
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

    } 
    if (directions.routes !== undefined){
        console.log('directions.routes: '+ directions.routes[0].distance)
    }
    
    
    

    return (

            <Submit
                onClick = {getDirections}>
                Let's go!
            </Submit>


    )
}

export default NavSearch;

const Submit = styled.button`
    position: absolute;
    z-index: 1;
    top: 100;
    left: 100;

`;
const SearchRouteForm = styled.form`


`;