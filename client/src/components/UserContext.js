import { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
    // For conditional rendering of the search bar
    const [search, setSearch] = useState(false);
    // For conditional rendering of the login / logout buttons
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // ?? To store backend user data in a state ??
    const [currentUser, setCurrentUser] = useState(false);
    // State to store origin of route requests
    const [origin, setOrigin] = useState(null);
    // State to store destination of route requests
    const [destination, setDestination] = useState(null);
    // To hold the user input converted to geoJSON format 
    // whilst we set origin/destination to originStation
    // etc whilst adding walking route layer to closest station
    const [convertedOriginInput, setConvertedOriginInput] = useState(null);
    const [convertedDestinationInput, setConvertedDestinationInput] = useState(null);

    // Initialize an array to store information about each rout that is added
    const [routesData, setRoutesData] = useState([]);

    const [tripDetails, setTripDetails] = useState({});
    
    const [busDuration, setBusDuration] = useState(0);

    const [publicTransitResult, setPublicTransitResult] = useState(null);
    
    const [stationStatus, setStationStatus] = useState(null);
    // State to trigger the use effect that adds stations to add stations
    // again on new route or user toggle of the station button !!! To do: create station togglebutton !!!
    const [addStations, setAddStations] = useState(null);

    // Create a state to hold the data from the backend
    // returning the bike station data
    const [bikeStations, setBikeStations] = useState([]);

    // State for origin and destination input by user in the form
    const [originInput, setOriginInput] = useState("6327 St Laurent Blvd, Montreal, Quebec  H2S 3C3")
    const [destinationInput, setDestinationInput] = useState("275 Notre-Dame St. East, Montreal, Quebec H2Y 1C6")


    // State that controls the route request functionality in the search bar
    const [searchForRoute, setSearchForRoute] = useState(false);

    // State for conditional rendering of page whilst waiting on fetches to back end\
    const [isLoading, setIsLoading] = useState(true);

    // Conditional rendering states for editing profile and settings
    const [editSettings, setEditSettings] = useState(false);
    // State for toggling the view of the edit profile form
    const [editProfile, setEditProfile] = useState(false);
    // Create a state to store the user's data
    const [userData, setUserData] = useState(null);
    

    return (
    <UserContext.Provider 
        value = {{
            search, 
            setSearch,
            isLoggedIn,
            setIsLoggedIn,
            currentUser,
            setCurrentUser,
            origin, setOrigin,
            destination,
            setDestination,
            convertedOriginInput, setConvertedOriginInput,
            convertedDestinationInput, setConvertedDestinationInput,
            routesData, setRoutesData,
            tripDetails, setTripDetails,
            busDuration, 
            setBusDuration,
            publicTransitResult, 
            setPublicTransitResult,
            stationStatus, 
            setStationStatus,
            bikeStations, 
            setBikeStations,
            addStations, 
            setAddStations,
            originInput, setOriginInput, destinationInput, setDestinationInput,
            searchForRoute, 
            setSearchForRoute,
            isLoading, setIsLoading,editSettings, setEditSettings, editProfile, setEditProfile, userData, setUserData
        }}>
            {children}
        </UserContext.Provider>)
};