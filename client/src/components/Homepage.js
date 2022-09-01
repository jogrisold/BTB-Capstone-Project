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
        {/* To be added and map removed once testing is complete */}
        {/* <Login />   */}
        <Map />
        </>    
        }
    </>
    )
}

export default Homepage;