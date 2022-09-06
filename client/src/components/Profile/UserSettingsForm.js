import { useState, useContext } from "react";
import styled from "styled-components";
import Input from "./Input";
import { UserContext } from "../UserContext";
import { BsToggleOff } from "react-icons/bs";
import { BsToggleOn } from "react-icons/bs";
import { MdDirectionsBike } from "react-icons/md";
import { MdElectricBike } from "react-icons/md";

const UserSettingsForm = ({ handleSubmit}) => {
    // Use context to bring in the current user that is logged in
    const {userData, setUserData} = useContext(UserContext);
    const [settingsData, setSettingsData] = useState({});
    const [useBikePaths, setUseBikePaths] = useState(userData.settings.use_bike_paths);

    console.log(useBikePaths);
    const handleChange = () => {
        console.log(useBikePaths);
        
        console.log(settingsData);
    };
    console.log(settingsData);


    const toggleUseBikePaths = (e) => {
        e.preventDefault()
        if(useBikePaths){
            setUseBikePaths(false);
            setSettingsData({
                ...settingsData,
                use_bike_paths: false,
                });
        } else {
            setUseBikePaths(true);
            setSettingsData({
                ...settingsData,
                use_bike_paths: true,
                });
        }
    }

    return (<>

                {/* <Ok onClick={handleChange}>Ok</Ok> */}
        <SettingsForm onSubmit={(e) => handleSubmit(e, settingsData)}>
        <ToggleBikePaths 
            onClick = {toggleUseBikePaths}>
            <FlexRow>
                <MdElectricBike size = {40} />
                {useBikePaths
                ?<BsToggleOn size = {40}/>
                :<BsToggleOff size = {40}/>
                }
                <MdDirectionsBike size = {40}/>
            </FlexRow>
        </ToggleBikePaths>
        <UserSettingsSubmit type="submit" >
            Confirm
        </UserSettingsSubmit>
        </SettingsForm>
    </>
    );
};


// Create our form
const SettingsForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const FlexRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
// Create our label styling
const Label = styled.label`
    font-size: 1rem;
    color: var(--color-secondary);
    background-color: white;
    text-align: left;
    font-size: 24px;
    width: 100%;
`;
const ToggleBikePaths = styled.button`
    color: var(--color-secondary);
    background-color: white;
    text-align: left;
    width: 200px;
    height: 50px;
    border: none;
`;
const Ok = styled.button`
    color: var(--color-secondary);
    background-color: white;
    text-align: left;
    width: 200px;
    height: 50px;
    border: none;
`;

// Button for form submission
const UserSettingsSubmit = styled.button`
  font-family: var(--font-heading);
  font-weight: bold;
  color: var(--color-quarternary);
  background-color: whitesmoke;
  font-size: 24px;
  border-radius: 5px;
  border: none;
  padding: 10px;
  cursor: pointer;
    transition: ease-in-out 100ms;
    &:hover{
      transform: scale(1.02);
    }
    &:active{
        transform: scale(.8);
        background-color: lightgray;
    }
`
export default UserSettingsForm;