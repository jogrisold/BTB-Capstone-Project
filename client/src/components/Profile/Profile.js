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
import { FiEdit } from "react-icons/fi";
import { MdTripOrigin } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsFolderPlus, BsThreeDotsVertical } from "react-icons/bs";

// Circular Progress animation for loading
import CircularProgress from '@mui/material/CircularProgress';
import UserSettingsForm from "./UserSettingsForm";
import ProfileHeader from "./ProfileHeader";
import SettingsHeading from "./SettingsHeading";

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
        searchForRoute, 
        setSearchForRoute,
        isLoading,
        setIsLoading
    } = useContext(UserContext);


    // Conditional rendering states for editing profile and settings
    const [editSettings, setEditSettings] = useState(false);
    // State for toggling the view of the edit profile form
    const [editProfile, setEditProfile] = useState(false);
    // Create a state to store the user's data
    const [userData, setUserData] = useState({settings: {use_bike_paths: true}});
    
    
    const navigate = useNavigate();
    //**************************************************************** */
    // Functions
    //**************************************************************** */

    // Use effect to load user data from database, in order to 
    // render updates to database live without need for page refresh
    useEffect(()=>{
        // If the user is logged in and they are not editing
        // their profile
        if (isLoggedIn && editProfile === false && currentUser) {
            console.log(currentUser);
            // Get the user data from the database
            fetch(`/api/users/${currentUser._id}`)
            .then(res=>res.json())
            .then((json)=>{
                console.log(json.data);
                // And store it in the userData state
                setUserData(json.data)      
            })
            setIsLoading(false);  
        }
    }, [currentUser, editProfile])

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
        .then((res) => res.json())
        .then((data) => {
            // Reset the current user state to render the new information 
            setCurrentUser({
                _id: currentUser._id,
                password: currentUser.password,
                given_name: data.data.given_name,
                family_name: data.data.family_name,
                email: data.data.email,
                home: data.data.home,
                work: data.data.work
            })
        });
        // Close the form
        setEditProfile(false);
        console.log("edit profile switched to false")
    }

    // Create a function to handle submission of the 
    // updateUserSettings form.
    const updateUsersettings = (e, settingsData) => {
        // Check that the user data is available for 
        // retreival by id in the database 

        if(userData){
            // Stop the page from refreshing
            e.preventDefault()
            console.log("submitted!")
            console.log(userData);

            const settings = {
                use_bike_paths: settingsData.use_bike_paths,
            }

            const bodyToSend = {
                _id: userData._id,
                settings: settings
            };
    
            fetch("/api/update-settings", {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyToSend),
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            });
        } else {
            window.alert("Please log in to submit settings")
        }
        // Close the form
        setEditSettings(false);
    }

    // Create a function to re-search a previous trip on the main page
    const searchTrip = (origin, destination) => {
        setOriginInput(origin);
        setDestinationInput(destination);
        navigate("/");
        setSearchForRoute(true);
    }

    const toggleEditProfile = () => {
        if(editProfile){
            setEditProfile(false);
        } else {
            setEditProfile(true);
        }
    }
    const toggleEditSettings = () => {
        if(editSettings){
            setEditSettings(false);
        } else {
            setEditSettings(true);
        }
    }
    return (
        <Center>
        <Wrapper>
        {/* If there is a current user (i.e. the user has logged in) */}
        {isLoading === false
        //Then return their profile
        ?   <>
            {editProfile 
            // Check if the editProfile button has been clicked,
            // If so, show the edit profile form
                ? 
                <>
                    <ProfileHeader toggleEditProfile = {toggleEditProfile}/>
                    <Line></Line> 
                    <UserProfileForm handleSubmit={updateUserProfile}/>
                    </>
                : // If not, display the user data
                <>
                    <ProfileHeader toggleEditProfile = {toggleEditProfile}/>
                    <Line></Line> 
                    <FlexRow>
                        <Name><Bold>Name:</Bold> {userData.given_name}</Name>
                        <Surname>{userData.family_name}</Surname>
                    </FlexRow>
                    <Email><Bold> Email: </Bold> {userData.email}</Email>
                    <Email><Bold> Home: </Bold> {userData.home}</Email>
                    <Email><Bold> Work: </Bold> {userData.work}</Email>
                </>
            }
            <Settings>
                {editSettings
                    // If editSettings has been set to true (edit button clicked), display the settings form
                ?   <>
                    <SettingsHeading toggleEditSettings={toggleEditSettings}/>
                    <Line></Line> 
                    <UserSettingsForm handleSubmit={updateUsersettings}/>
                    </>
                :   // Otherwise, render the user settings from database
                    <>
                    <SettingsHeading toggleEditSettings={toggleEditSettings}/>
                    <Line></Line> 
                    {userData
                        // if the userData has been populated
                    ?  Object.values(userData.settings).length > 0 
                        // Check that they have created settings
                        ? <> Settings: bike: 
                            {userData.settings.use_bike_paths 
                                ? <Yes> Yes</Yes>
                                : <No> No </No>
                                } 
                        </>
                        : <>
                            <p>You don't have any settings yet.</p>
                            <Login>Click the edit settings icon above to edit your settings </Login>
                        </>
                        
                    : <> User data did not load yet</>
                    }
                   
                    </>
                }
            </Settings>
            
            <FlexHeader>
                <H1>Previous Trips</H1>
            </FlexHeader>
            <Line></Line> 
            {isLoading && userData
                // If the data has been fetched from the backend
                ? userData.previous_searches.length > 0
                // Check if the user has populated the previous_searches array
                    ? userData.previous_searches.map((search)=>{
                        // If so, return th previous searches
                        return(<>
                            <Trip
                                onClick={()=>searchTrip(search.origin, search.destination)}>
                                <Origin><MdTripOrigin/>{search.origin}</Origin>
                                <Origin><BsThreeDotsVertical/></Origin>
                                <Origin><FaMapMarkerAlt/>{search.destination}</Origin>
                            </Trip>
                            </>
                        )
                        })
                    :<>You have not completed any previous trips</>
                : <>You have not completed any previous trips</>
                }
        </>
        // Otherwise, display a loading animation
        : <><Center><CenterCircular><CircularProgress/></CenterCircular></Center></>
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
`
const LoginLink = styled(Link)`
   padding: 0 5px;
   font-weight: bold;
   text-decoration: none;
   color: var(--color-secondary);
   &:hover {
        color: var(--color-primary);
   }

`
const Wrapper= styled.div`
    display: flex;
    width: 80%;
    flex-direction: column;
    align-items: left;
    margin-top: 100px;
`;
const Edit = styled.button`
    border: none;
    background-color: white;
    margin: 0 0 -28px 0;
    color: var(--color-secondary);
`;
const Name = styled.div`
    font-size: 20px;
`;
const Surname = styled.div`
    margin:  0 0 0 10px;
    font-size: 20px;
`;
const Email = styled.div`
    margin: 10px 0 10px 0;
    font-size: 20px;
`;
const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;
const FlexRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: top;
    align-items: top;
    text-align: top;
    margin: 10px 0 10px 0;
`;
const FlexHeader = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const Bold = styled.span`
    font-weight: 800;
    margin-right: 2px;
`;
const Settings = styled.div`

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