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
    // Closest station to origin as determined by nearestStationCalc
    const [originStation, setOriginStation] = useState(null);
    // Closest station to desination as determined by nearestStationCalc
    const [destinationStation, setDestinationStation] = useState(null);

    
    return (
    <UserContext.Provider 
        value = {{
            search, 
            setSearch,
            isLoggedIn,
            setIsLoggedIn,
            origin,
            setOrigin,
            destination,
            setDestination,
            originStation, 
            setOriginStation,
            destinationStation,
            setDestinationStation,
            convertedOriginInput,
            setConvertedOriginInput,
            convertedDestinationInput,
            setConvertedDestinationInput
        }}>
            {children}
        </UserContext.Provider>)
};