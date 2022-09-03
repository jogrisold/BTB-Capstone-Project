import { useState, useContext } from "react";
import styled from "styled-components";
import Input from "./Input";
import { UserContext } from "../UserContext";
import { FcCurrencyExchange } from "react-icons/fc";

const UserProfileForm = ({ handleSubmit }) => {
    // Use context to bring in the current user that is logged in
    const {setCurrentUser} = useContext(UserContext);
    const [profileData, setProfileData] = useState({});

    const handleChange = (key, value) => {
        setProfileData({
        ...profileData,
        [key]: value,
        });
    };

    return (
        <ProfileForm onSubmit={(e) => handleSubmit(e, profileData)}>
        <Input
            type="text"
            placeholder="Given Name"
            name={"given_name"}
            required={true}
            handleChange={handleChange}
        />
        <Input
            type="text"
            placeholder="Family Name"
            name={"family_name"}
            required={true}
            handleChange={handleChange}
        />
        <Input
            type="email"
            placeholder="Email"
            name={"email"}
            required={true}
            handleChange={handleChange}
        />
        <Input
            type="home"
            placeholder="Home Address"
            required={true}
            name={"home"}
            handleChange={handleChange}
        />
        <Input
            type="work"
            placeholder="Work Address"
            name={"work"}
            required={true}
            handleChange={handleChange}
        />
        
        <UserProfileSubmit type="submit" >
            Confirm
        </UserProfileSubmit>
        </ProfileForm>
    );
};


// Create our form
const ProfileForm = styled.form`

    display: flex;
    flex-direction: column;
    width: 100%;
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

// Button for form submission
const UserProfileSubmit = styled.button`
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
export default UserProfileForm;