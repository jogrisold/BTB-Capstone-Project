//**************************************************************** */
// Imports
//**************************************************************** */

// React routing dependencies
import { Route, Routes, BrowserRouter } from "react-router-dom";
import styled from 'styled-components';

// Local components
import GlobalStyles from "./GlobalStyles";
import Homepage from "./Homepage";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile/Profile";
import Header from './Header';

// required by mabox
import mapboxgl from '!mapbox-gl';  


// my mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug';


const App = () => {

  return (
    <Wrapper>
      <GlobalStyles />
      <BrowserRouter>
        <Header />
        <Routes>
            {/* react router v6 uses element attribute to render components */}
            <Route exact path="/React" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </BrowserRouter>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
    
`;