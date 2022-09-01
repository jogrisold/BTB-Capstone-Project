import { useContext } from "react";
import Login from "./Login";
import { UserContext } from "./UserContext";
import Map from "./Map";

const Homepage = () => {
    const {
        isLoggedIn,
        setIsLoggedIn,
    } = useContext(UserContext);
    return (
    <>
    {isLoggedIn
    ? <>
        <Map />
        </>
    :   <>
        <Login />  
        </>    
        }
    </>
    )
}

export default Homepage;