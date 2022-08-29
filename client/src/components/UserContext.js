import { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
    // For conditional rendering of the search bar
    const [search, setSearch] = useState(false);
    // For conditional rendering of the login / logout buttons
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // ?? To store backend user data in a state ??
    const [currentUser, setCurrentUser] = useState(false);

    // TO DO
    const [flight, setFlight] = useState(null);
    const [seat, setSeat] = useState(null);
    const [givenName, setGivenName] = useState(null);
    const [surname, setSurname] = useState(null);
    const [email, setEmail] = useState(null);
    
    return (
    <UserContext.Provider 
        value = {{
            search, 
            setSearch,
            isLoggedIn,
            setIsLoggedIn,
            flight,
            setFlight,
            seat,
            setSeat,
            givenName,
            setGivenName,
            surname,
            setSurname,
            email,
            setEmail
        }}>
            {children}
        </UserContext.Provider>)
};