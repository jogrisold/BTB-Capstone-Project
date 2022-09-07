//**************************************************************** */
// Imports
//**************************************************************** */

// React dependencies
import styled from "styled-components"
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Local component dependencies
import { UserContext } from "../UserContext";
import UserProfileForm from "./UserProfileForm";

// Icons
import { MdTripOrigin } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

// Circular Progress animation for loading
import CircularProgress from '@mui/material/CircularProgress';
import ProfileHeader from "./ProfileHeader";
import Settings from "./Settings";
import UserData from "./UserData";


// It's your profile! 
const Profile = () => {

    //**************************************************************** */
    // Constants
    //**************************************************************** */

    // Use context to bring in needed states
    const { 
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setOriginInput, 
        setDestinationInput, 
        setSearchForRoute,
        setRoutesData,
        editProfile, setEditProfile, userData, setUserData
    } = useContext(UserContext);

    // State for conditional rendering of page whilst waiting on fetches to back end\
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    //**************************************************************** */
    // Functions
    //**************************************************************** */

    // Use effect to load user data from database, in order to 
    // render updates to database live without need for page refresh
    useEffect(()=>{
        // If the user is logged in and they are not editing
        // their profile
        if (isLoggedIn && currentUser && isLoading === true) {
            // Give the server somt time to update
            setTimeout(()=>{
                // Get the user data from the database
                fetch(`/api/users/${currentUser._id}`)
                .then((res)=>res.json())
                .then((data)=>{
                    console.log(data.data);
                    // Store it in the userData state
                    setUserData(data.data)      
                })
            }, 2300)

                // Render the page
                setIsLoading(false);
        }
    }, [isLoading])

    // Create a function to handle submission of the 
    // updateUserProfile form
    const updateUserProfile = (e, profileData) => {
        // Stop the page from refreshing
        e.preventDefault()
        console.log("submitted!")
        // Create an object using the data held in the profileData 
        // state as set onChange in the Input elements of the form
        const updatedProfile = {
            given_name: profileData.given_name,
            family_name: profileData.family_name,
            email: profileData.email,
            home: profileData.home,
            work: profileData.work
          };
        // Send a patch request with the object stringified into JSON format
        fetch("/api/update-profile", {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
        })

        // Reset the loading state to recall the fetch
        setIsLoading(true);
        // Close the form
        setEditProfile(false);
        console.log(userData);
    }

    // Create a function to re-search a previous trip on the main page
    const searchTrip = (origin, destination) => {
        // Set the input values of the search bar
        setOriginInput(origin);
        setDestinationInput(destination);
        // Reset the data for the route to avoid multiple trip distances
        // being summed in TripDetails
        setRoutesData([]);
        // Navigate to the homepage
        navigate("/");
        // Fixes render issue of homepage displaying as scrolled halfway
        // down on load
        window.scrollTo({
            top: 0,
            left: 100,
        });
        // Set the state that calls the geoJSON fetch and
        // corresponding routing functions
        setSearchForRoute(true);
    }

    const toggleEditProfile = () => {
        if(editProfile){
            setEditProfile(false);
        } else {
            setEditProfile(true);
        }
    }

    return (
        <Center>
        <Wrapper>
        {isLoggedIn
            ? isLoading === false && userData !== null && userData !== undefined
                //Then return their profile
                ?   <>
                    <ProfileHeader toggleEditProfile = {toggleEditProfile}/>
                    <Line></Line> 
                    {editProfile // Check if the editProfile button has been clicked,
                        ? // If so, show the edit profile form
                          <UserProfileForm handleSubmit={updateUserProfile}/>
                        : // If not, display the user data
                        <> 
                           <UserData />
                        </>
                    }
                    
                    <Settings isLoading = {isLoading} setIsLoading = {setIsLoading}/>
                    <FlexHeader>
                        <H1>Previous Trips</H1>
                    </FlexHeader>
                    <Line></Line> 
                    {userData // If the data has been fetched from the backend (i.e. userData.previous_searches is available)
                        && userData.previous_searches.length > 0 // Check if the user has populated the previous_searches array
                            ? // If so, return the previous searches
                              userData.previous_searches.map((search)=>{
                                return(
                                    <Trip
                                        onClick={()=>searchTrip(search.origin, search.destination)}>
                                        <Origin><MdTripOrigin/>{search.origin}</Origin>
                                        <Origin><BsThreeDotsVertical/></Origin>
                                        <Origin><FaMapMarkerAlt/>{search.destination}</Origin>
                                    </Trip>
                                )
                                })
                            : // Otherwise, let the user know that they need to search first to populate the array
                              <>You have not completed any previous trips</>
                        }
                </>
                // Otherwise, display a loading animation
                : <><Center><CenterCircular><CircularProgress/></CenterCircular></Center></>
                
        : <>Please login to continue</>
        }
            
    </Wrapper>
    </Center>
    )
}

// Export the component for use in /profile
export default Profile;

//**************************************************************** */
// Styled Components
//**************************************************************** */

const Center= styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    font-size: 18px;
    font-family: var(--font-body);
`;
const CenterCircular= styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    font-size: 18px;
    font-family: var(--font-body);
`;
const Login = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
`;
const LoginLink = styled(Link)`
   padding: 0 5px;
   font-weight: bold;
   text-decoration: none;
   color: var(--color-secondary);
   &:hover {
        color: var(--color-primary);
   }
`;
const Wrapper= styled.div`
    display: flex;
    width: 80%;
    flex-direction: column;
    align-items: left;
    margin-top: 100px;
`;
const FlexHeader = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Line = styled.div`
    border: 1px solid var(--color-secondary);
    margin: 10px 0 30px 0;
`;
const Origin = styled.div`
    font-size: 12px;
    display: flex;
    align-items: center;
`;
const Trip = styled.div`
    margin: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;
const H1 = styled.h1`
    text-align: left;
    margin: 40px 0 10px 0;
    font-size: 30px !important;
`;
const Yes = styled.div`
    color: black;
`;
const No = styled.div`
    color: black;
`;