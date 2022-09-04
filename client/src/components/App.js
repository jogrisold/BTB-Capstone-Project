//**************************************************************** */
// Imports
//**************************************************************** */

// React routing dependencies
import { Route, Routes, BrowserRouter } from "react-router-dom";

import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import GlobalStyles from "./GlobalStyles";
import Homepage from "./Homepage";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile/Profile";
import Footer from "./Footer";

import Header from './Header';

// required by mabox
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Preferences from "./Profile/Preferences";

// my mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug';

// const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

const App = () => {

  return (
    <Wrapper>
      <GlobalStyles />
      <BrowserRouter>
        <Header />
        <Routes>
            {/* react router v6 uses element attribute to render components */}
            <Route exact path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/preferences" element={<Preferences/>}/>
        </Routes>

        <Footer />
      </BrowserRouter>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
    
`;