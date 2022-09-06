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
const Settings = ({isLoading, setIsLoading,}) => {

    const {isLoggedIn, currentUser,
         editSettings, setEditSettings, editProfile, setEditProfile, userData, setUserData} = useContext(UserContext);


    useEffect(()=>{
        // If the user is logged in and they are not editing
        // their profile
        if (isLoggedIn && currentUser && isLoading !== undefined && isLoading === true) {
            console.log(currentUser);
            // Give the server somt time to update
            setTimeout(()=>{
                // Get the user data from the database
                fetch(`/api/users/${currentUser._id}`)
                .then((res)=>res.json())
                .then((data)=>{
                    console.log(data.data);
                    // And store it in the userData state
                    setUserData(data.data)      
                })
                // Render the page
                setIsLoading(false);
            }, 1300)
        }
    }, [isLoading])

    // Create a function to handle submission of the 
    // updateUserSettings form.
    const updateUserSettings = (e, settingsData) => {
        // Check that the user data is available for 
        // retreival by id in the database 
        console.log(settingsData);
        if(userData){
            // Stop the page from refreshing
            e.preventDefault()
            console.log("submitted!")

            const updatedSettings = {
                use_bike_paths: settingsData.use_bike_paths,
            }

            const bodyToSend = {
                _id: userData._id,
                settings: updatedSettings
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

        // Reset the loading state to recall the fetch
        setIsLoading(true);

        // Close the form
        setEditSettings(false);
    }

    const toggleEditSettings = () => {
        if(editSettings){
            setEditSettings(false);
        } else {
            setEditSettings(true);
        }
    }

    return (
        <SettingsMain>
        {editSettings
            // If editSettings has been set to true (edit button clicked), display the settings form
        ?   <>
            <SettingsHeading toggleEditSettings={toggleEditSettings}/>
            <Line></Line> 
            <UserSettingsForm handleSubmit={updateUserSettings}/>
            </>
        :   // Otherwise, render the user settings from database
            <>
            <SettingsHeading toggleEditSettings={toggleEditSettings}/>
            <Line></Line> 
            {userData
                // if the userData has been populated
            ?  Object.values(userData.settings).length > 0 
                // Check that they have created settings
                ? <> Use bike path: 
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
        </SettingsMain>
    )
}

// Export the component for use in /profile
export default Settings;

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
const SettingsMain = styled.div`

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