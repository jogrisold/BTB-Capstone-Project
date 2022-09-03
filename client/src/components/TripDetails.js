import { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";

const TripDetails = () => {
    // set a state for origin and destination, or you could use a useContext file
    const {
        routesData, 
        setRoutesData,
        tripDetails,
        setTripDetails,
        busDuration,
        setBusDuration,
        publicTransitResult,
        

    } = useContext(UserContext);


    const [displayTripDetails, setDisplayTripDetails] = useState(false);

    // Use effect to run the bikeTripDuration calculation once routesData is set
    useEffect(()=>{
        if (publicTransitResult !== null && routesData.length > 0){
            bikeTripDuration();
            publicTransitDuration();
            setDisplayTripDetails(true);
        }
    },[publicTransitResult, routesData])

    // Create a function that will calculate the total trip duration 
    // to display to the user in minutes and kilometers
    const bikeTripDuration = () => {
        let totalTripTime = 0;
        let totalTripDistance = 0;
        let walkingTime = 0;
        let walkingDistance = 0;
        routesData.map((i)=>{
            // For each leg, sum duration and distance
            totalTripTime += i.duration;
            totalTripDistance += i.distance;
            // If the data is for pedestrian travel,
            // sum the walking distance and duration
            if(i.weight_name == "pedestrian"){
                walkingTime += i.duration;
                walkingDistance += i.distance; 
            }
        })
        setTripDetails(
            {
            ...tripDetails,
            "totalTripTime": Math.round(totalTripTime/60), 
            "totalTripDistance": Math.round(100*totalTripDistance/1000)/100, 
            "walkingTime": Math.round(walkingTime/60),
            "walkingDistance": Math.round(100*walkingDistance/1000, 2)/100
            }
        )
    }

    const publicTransitDuration = () => {
        const sections = publicTransitResult.routes[0].sections
        const departure = new Date(sections[0].departure.time);
        const arrival = new Date(sections[sections.length - 1].arrival.time);
        const travelTime = (arrival.getTime() - departure.getTime()) / (1000 * 60);
        setBusDuration(travelTime);
    }

    return (<>
            {displayTripDetails
            ? <TripDetailsInfo>
                <TripDistance> <Text>TD:</Text>{tripDetails.totalTripDistance}km</TripDistance>
                <TripTime> <Text>/</Text> {tripDetails.totalTripTime}mins</TripTime>
                <WalkingDistance><Text>WD:</Text>{tripDetails.walkingDistance}km</WalkingDistance>
                <WalkingTime> <Text>/</Text> {tripDetails.walkingTime}mins</WalkingTime>
                <BusDuration><Text>B:</Text> {busDuration} mins</BusDuration>
            </TripDetailsInfo>
            : <></>
            }
            </>
    ) 
}

export default TripDetails;

const TripDetailsInfo = styled.div`
    position: absolute;
        z-index: 1;
        bottom: 0;
        left: 0;
    display: flex;
    gap: 0px;
    width: 100%;
    height: 70px;
    background-color: var(--color-secondary);
    font-size: 20px;
`;

const TripDistance = styled.div`
    color: white;
`;
const TripTime = styled.div`
    color: white;
`;
const WalkingTime = styled.div`
    color: white;
`;
const WalkingDistance = styled.div`
    color: white;
    margin:  0 0 0 0px;
`;
const BusDuration = styled.div`
    color: white;
    margin:  0 0 0 0px;
`;
const Text = styled.span`
    color: var(--color-tertiary);
`;
