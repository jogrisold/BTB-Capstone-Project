import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import styled from "styled-components";

const ProfileHeader = ({toggleEditProfile}) =>{

    const [color, setColor] = useState(true);

    // Nothing to see here, return the header element   
    return(
        <FlexHeader>
        <H1>Profile</H1>
            <Edit>
                <FiEdit 
                    onClick={()=>{toggleEditProfile(); setColor(!color)}}
                    size = {30}/>
            </Edit>
        </FlexHeader>
    )
}

export default ProfileHeader;

const Edit = styled.button`
    border: none;
    background-color: white;
    margin: 0 0 -28px 0;
    color: var(--color-secondary);
`;
const FlexHeader = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const H1 = styled.h1`
    text-align: left;
    margin: 40px 0 10px 0;
    font-size: 30px !important;
`;