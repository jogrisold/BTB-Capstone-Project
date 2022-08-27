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
import Profile from "./Profile";
import Footer from "./Footer";

import Map from './Map';
import Header from './Header';

// required by mabox
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

// my mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug';

// const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

const App = () => {

  return (
    <Wrapper>
      <GlobalStyles />
      <BrowserRouter>
        <Header />
        <Map />
        
        <Routes>
            {/* react router v6 uses element attribute to render components */}
            <Route exact path="/" element={<Homepage />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/profile" element={<Profile/>}/>
        </Routes>

        <Footer />
      </BrowserRouter>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
    
`;