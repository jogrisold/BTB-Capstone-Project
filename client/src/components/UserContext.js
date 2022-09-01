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
            convertedOriginInput,
            setConvertedOriginInput,
            convertedDestinationInput,
            setConvertedDestinationInput,
            routesData,
            setRoutesData,
            tripDetails,
            setTripDetails,
            busDuration, 
            setBusDuration,
            publicTransitResult, 
            setPublicTransitResult
        }}>
            {children}
        </UserContext.Provider>)
};