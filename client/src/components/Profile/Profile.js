//**************************************************************** */
// Imports
//**************************************************************** */

// React dependencies
import styled from "styled-components"
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Local component dependencies
import { UserContext } from "../UserContext";
import UserProfileForm from "./UserProfileForm";

// Icons
import { FiEdit } from "react-icons/fi";

// It's your profile! 
const Profile = () => {

    //**************************************************************** */
    // Constants
    //**************************************************************** */

    // Use context to bring in the current user that is logged in
    const {currentUser, setCurrentUser, userData, setUserData} = useContext(UserContext);

    
    
    // Conditional rendering states for editing profile and settings
    const [editProfile, setEditProfile] = useState(false);
    const [editSettings, setEditSettings] = useState(false);

    const [geoJSONAddress, setGeoJSONAddress] = useState(null);
    
    //**************************************************************** */
    // Functions
    //**************************************************************** */

    useEffect(()=>{
        if (currentUser) {
            console.log(currentUser);
            fetch(`/api/users/${currentUser._id}`)
            .then(res=>res.json())
            .then((data)=>{
                console.log(data.data);
                setUserData(data.data)         
            })
        }
    }, [currentUser, editProfile])

    // Function to fetch the geoJSON position to store in database
    // const convertAddress = (address) =>{
    //     const fetchAddress = JSON.stringify(address.replaceAll(" ", "&"));
    //     fetch(`/get-position/${fetchAddress}`)
    //         .then((res) => res.json())
    //         .then((data) => {
    //         setGeoJSONAddress(data.data)
    //     });
    //     return geoJSONAddress();
    // }

    const updateUserProfile = (e, profileData) => {
        // Stop the page from refreshing
        e.preventDefault()
        console.log("submitted!")
        const updatedProfile = {
            given_name: profileData.given_name,
            family_name: profileData.family_name,
            email: profileData.email,
            home: profileData.home,
            work: profileData.work
          };
          fetch("/api/update-profile", {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProfile),
          })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
            });
        // Close the form
        setEditProfile(false);
    }

    return (
        <Center>
            <Wrapper>
            {/* If there is a current user (i.e. the user has logged in) */}
                {currentUser 
                //Then return their profile
                ?   <>
                    {editProfile 
                    // Check if the editProfile button has been clicked,
                    // If so, show the edit profile form
                        ? 
                        <>
                            <FlexHeader>
                            <H1>Profile</H1>
                                <Edit>
                                    <FiEdit 
                                        onClick={()=>{
                                            if(editProfile){
                                                setEditProfile(false);
                                            } else {
                                                setEditProfile(true);
                                            }
                                            }}
                                        size = {30}/>
                                </Edit>
                            </FlexHeader>
                            <Line></Line> 
                           <UserProfileForm handleSubmit={updateUserProfile}/>
                            </>
                        : // If not, display the user data
                        <>
                            <FlexHeader>
                                <H1>Profile</H1>
                                <Edit>
                                    <FiEdit 
                                        onClick={()=>{
                                            if(editProfile){
                                                setEditProfile(false);
                                            } else {
                                                setEditProfile(true);
                                            }
                                            }}
                                        size = {30}/>
                                </Edit>
                            </FlexHeader>
                            <Line></Line> 
                            <FlexRow>
                                <Name><Bold>Name:</Bold> {currentUser.given_name}</Name>
                                <Surname>{currentUser.family_name}</Surname>
                            </FlexRow>
                            <Email><Bold> Email: </Bold> {currentUser.email}</Email>
                            <Email><Bold> Home: </Bold> {currentUser.home}</Email>
                            <Email><Bold> Work: </Bold> {currentUser.work}</Email>
                        </>
                        }
            
                    <Settings>
                        <FlexHeader>
                        <H1>Settings</H1>
                        <Edit>
                            <FiEdit 
                                onClick={()=>{
                                    if(editSettings){
                                        setEditSettings(false);
                                    } else {
                                        setEditSettings(true);
                                    }
                                    }}
                                size = {30}/>
                        </Edit>
                        </FlexHeader>
                        <Line></Line> 
                        {userData 
                        ?
                           <>
                            This is where the preferences go!
                           </>
                            :
                            <>
                            <p>You don't have any preferences yet.</p>
                            <Login>You can add preferences<LoginLink to ="/preferences" style={{color: "var(--color-secondary)"}}> here</LoginLink> </Login>
                            </>
                        }
                    </Settings>
                </>
            // Otherwise, direct the user to login first
            : <Login>Please <LoginLink to ="/login" style={{color: "var(--color-secondary)"}}> login</LoginLink> to continue</Login>
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
    width: 70%;
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
const Total = styled.div` 
    font-weight: 800;
    margin: 10px 0;
`;
const Settings = styled.div`

`;
const OrderNumber = styled.div`
    font-weight: 800;
    margin: 0 0 10px;
`;

const Line = styled.div`
    border: 1px solid var(--color-secondary);
    margin: 10px 0 30px 0;
`;
const H1 = styled.h1`
    text-align: left;
    margin: 40px 0 10px 0;
    font-size: 30px !important;
`;
