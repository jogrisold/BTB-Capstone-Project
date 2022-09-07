import { useContext } from "react";
import { UserContext } from "../UserContext";
import styled from "styled-components";

const UserData = () =>{
    const {userData} = useContext(UserContext);

    return(
        <>
             <FlexRow>
                <Name><Bold>Name:</Bold> {userData.given_name}</Name>
                <Surname>{userData.family_name}</Surname>
            </FlexRow>
            <Email><Bold> Email: </Bold> {userData.email}</Email>
            <Email><Bold> Home: </Bold> {userData.home}</Email>
            <Email><Bold> Work: </Bold> {userData.work}</Email>
        </>
    )
}

export default UserData;

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
const Bold = styled.span`
    font-weight: 800;
    margin-right: 2px;
`;