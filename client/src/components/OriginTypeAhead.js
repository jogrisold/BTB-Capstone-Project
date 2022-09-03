import {useState, useContext} from 'react';
import styled from 'styled-components';
import { UserContext } from './UserContext';

const OriginTypeAhead = () => {

    const {currentUser} = useContext(UserContext);
    const [inputValue, setInputValue] = useState("");
    const [searchNotSelected, setSearchNotSelected] = useState(true);

    // Return results that match what the user types
    const previousSearches = currentUser.previous_searches.filter(search => {
        return search.origin.toLowerCase().includes(inputValue.toLowerCase())
    })
    // When a user clicks on a suggestion, navigate to the item details page and clear the input field
    const handleSuggestionClick = (origin) => {
        setInputValue(origin);
        // Clear the list of searches
        setSearchNotSelected(false);
    } 

    return (
        <>
        <FlexCol>
            <FlexRow>
                <SearchBar 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => {setInputValue(e.target.value); }} 
                />
                <ClearBtn type = "button" onClick={()=> {setInputValue("")}}>Clear</ClearBtn>
            </FlexRow>
        {previousSearches.length > 0 && inputValue.length >= 2 && searchNotSelected &&
        // If the previous searches has been populated and the user has typed enough input to render 
        // a meaningful result, and a search item has not been selected, render the search list
            <SearchList>
                {previousSearches.map(search => {
                    // Find index of word and split for styling
                    let indexOfsecondHalf = search.origin.toLowerCase().indexOf(inputValue.toLowerCase())
                    let firstHalf = search.origin.slice(0, indexOfsecondHalf + inputValue.length)
                    let secondHalf = search.origin.slice(indexOfsecondHalf + inputValue.length)
                    // Clicking a suggestion navigates to the search details page
                    return (
                        <SearchListItem 
                            onClick={()=> {handleSuggestionClick(search.origin)}}
                            >
                            {firstHalf}
                            <Prediction>{secondHalf}</Prediction> 
                        </SearchListItem>
                    )
                })
                }
            </SearchList> 
        }
        </FlexCol>
        </>
    );
};

export default OriginTypeAhead;

const SearchBar = styled.input`
    font-size: 16px;
    height: 30px;
    width: 100%;
    border: 2px solid var(--color-secondary);
    &:focus-visible {
        outline: 2px solid var(--color-secondary);
    }
`;
const ClearBtn = styled.button`
    color: #fff;
    background-color: var(--color-secondary);
    border: none;
    font-size: 19px;
    padding: 5px 10px;
    transition: ease-in-out 100ms;
    &:focus-visible {
        outline: 4px lightblue solid ;
    }
    &:hover{
        transform: scale(1.1);
    }
    &:active{
        transform: scale(.9);
        background-color: var(--color-primary);
    }
`;
const SearchList = styled.ul`
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    padding: 10px;
    width: 100%;
    background-color: white;
    font-size: 12px;
`;
const SearchListItem = styled.li`
    z-index: 1;
    padding: 5px;
    font-size: 14px;
    &:hover {
        background-color: whitesmoke;;
    }
`;
const Prediction = styled.span`
    font-weight: bold;
`;
const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
`;
const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;