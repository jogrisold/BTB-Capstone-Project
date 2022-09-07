//**************************************************************** */
// Imports
//**************************************************************** */

// React dependencies
import styled from "styled-components"
import { useContext, useState, useEffect } from "react";
import { Link} from "react-router-dom";

// Local component dependencies
import { UserContext } from "../UserContext";

// Circular Progress animation for loading
import UserSettingsForm from "./UserSettingsForm";
import SettingsHeading from "./SettingsHeading";

// It's your profile! 
const Settings = ({isLoading, setIsLoading}) => {

    const {userData} = useContext(UserContext);

    // Conditional rendering states for editing profile and settings
    const [editSettings, setEditSettings] = useState(false);

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
            <SettingsHeading toggleEditSettings={toggleEditSettings}/>
            <Line></Line> 
        {editSettings
            // If editSettings has been set to true (edit button clicked), display the settings form
        ?   <>
            <UserSettingsForm handleSubmit={updateUserSettings}/>
            </>
        :   // Otherwise, render the user settings from database
            <>
            {userData
                // if the userData has been populated
            ?  Object.values(userData.settings).length > 0 
                // Check that they have created settings
                ?<>
                {userData.settings.use_bike_paths 
                    ? <FlexRow>
                        <BikePath> Use bike paths: </BikePath>
                        <Yes> Yes</Yes>
                      </FlexRow>
                    :<FlexRow>
                       <BikePath> Use bike paths: </BikePath>
                       <No> No </No>
                     </FlexRow>
                    } 
                </>
                
                : <>
                    <Login>You don't have any settings yet.</Login>
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

const Login = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: white;
`;
const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
`;

const SettingsMain = styled.div`

`;
const Line = styled.div`
    border: 1px solid white;
    margin: 10px 0 30px 0;
`;
const Yes = styled.div`
    margin:  0 0 0 10px;
`;
const No = styled.div`
    margin:  0 0 0 10px;
`;
const BikePath = styled.div`
    color: white;
`;