//**************************************************************** */
// Imports
//**************************************************************** */

// Import react dependencies
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Local dependencies
import logo from "../assets/logo.png";


// Icons
import { BsCartDash } from "react-icons/bs";
import { BsCartCheckFill } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { useState } from "react";


// The Header is an element that will sit at the top of 
// all pages, it is defined as a constant here and passed
// to App.
const Header = () => {

    //**************************************************************** */
    // Constants
    //**************************************************************** */

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState(false)
    
    // Define a navigator to allow us to use Navigate to move
    // the user to the desired page without them clicking on 
    // any links
    const navigate = useNavigate();
    
    // Function that navigates to the specified route (/profile) on click
    const handleClick = (routename) => {
        navigate(`/${routename}`)
    }

    // Create a function to handle click of logot button
    const handleClickLogOut = () => {
        setCurrentUser(null);
        setIsLoggedIn(false);

    }

    //**************************************************************** */
    // Render
    //**************************************************************** */

    return(
        <>
        <Wrapper>
            <LogoAndSearch>
                <Logo src = {logo} onClick={()=> {handleClick("")}}/>
            </LogoAndSearch>
            <FlexRow>
                {/* Render full cart icon when cart has items in it */}
                
                {/* Only render profile page when user is logged in */}
                {isLoggedIn &&
                    <ProfileBtn onClick={()=> {handleClick("profile")}}><FaRegUser size = {40}/></ProfileBtn>
                }
                
                {/* Conditional rendering for button based on 
                whether the user is logged in or not */}
                {isLoggedIn
                    ? <LogOut
                        onClick={handleClickLogOut}
                        >
                        Logout
                        </LogOut> 
                    : <LogIn
                        onClick={()=> {handleClick("login")}}
                        >
                        Login
                        </LogIn>
                }
            </FlexRow>
        </Wrapper>
        </>
    )
};

// Export the component to be used in App
export default Header;

//**************************************************************** */
// Styled-Components
//**************************************************************** */

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: var(--color-secondary);
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
`;
const LogoAndSearch = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const FlexRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: center;
`;
const Logo = styled.img`
    width: 150px;
    margin: 0 0 0 20px;
`;
const ProfileBtn = styled.button`
    color: white;
    background-color: var(--color-secondary);
    border: none;
    padding-top: 10px;
    margin: 0 20px;
    cursor: pointer;
    transition: ease-in-out 200ms;
    &:hover {
        transform: scale(1.2);
        color: var(--color-primary);
    }
    &:active{
        transform: scale(.8);
    }
`;
const LogIn = styled.button`
    font-family: var(--font-heading);
    color: white;
    font-size: 20px;
    border: 2px solid white;
    border-radius: 10px;
    padding: 8px 10px;
    align-items: left;
    text-align: center;
    background-color: var(--color-secondary);
    cursor: pointer;
    transition: ease-in 300ms;
    &:hover {
        border-color: var(--color-secondary);
        color:var(--color-secondary);
        background-color: white;
        transform: scale(1.1);
    }
    &:active{
        border-color: var(--color-quarternary);
        color: var(--color-quarternary);
        transition: ease-in 100ms;
        transform: scale(.8);
    }
`;
const LogOut = styled.button`
    font-family: var(--font-heading);
    font-size: 20px;
    border: 2px solid white;
    border-radius: 10px;
    padding: 8px 10px;
    color: white;
    margin: 0 20px;
    align-items: center;
    text-align: center;
    background-color: var(--color-secondary);
    cursor: pointer;
    transition: ease-in 300ms;
    &:hover {
        border-color: var(--color-secondary);
        color:var(--color-secondary);
        background-color: white;
        transform: scale(1.1);
    }
    &:active{
        border-color: var(--color-quarternary);
        color: var(--color-quarternary);
        transition: ease-in 100ms;
        transform: scale(.98);
    }
`;