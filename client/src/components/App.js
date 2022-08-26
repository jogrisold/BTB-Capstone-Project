import React, { useRef, useEffect, useState } from 'react';

import Map from './Map';

// required by mabox
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

// my mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug';

// const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

const App = () => {

  // // States required by mapbox
  // const mapContainer = useRef(null);
  // const map = useRef(null);
  // const [lng, setLng] = useState(-73.5674);
  // const [lat, setLat] = useState(45.5019);
  // const [zoom, setZoom] = useState(9);
  
  // // Required by mapbox
  // useEffect(() => {
  //   if (map.current) return; // initialize map only once
  //   map.current = new mapboxgl.Map({
  //   container: mapContainer.current,
  //   style: 'mapbox://styles/mapbox/streets-v11',
  //   center: [lng, lat],
  //   zoom: zoom
  //   });
  //   });
  
  // // Required by mapbox: Store the new co-ordinates 
  // useEffect(() => {
  //   if (!map.current) return; // wait for map to initialize
  //   map.current.on('move', () => {
  //   setLng(map.current.getCenter().lng.toFixed(4));
  //   setLat(map.current.getCenter().lat.toFixed(4));
  //   setZoom(map.current.getZoom().toFixed(2));
  //   });
  //   });

// *****************************************************
// Beginning of my customization
// *****************************************************

  const [stations, setStations] = useState([]);
  // mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug';
  // const map = new mapboxgl.Map({
  //     container: 'map',
  //     style: 'mapbox://styles/mapbox/streets-v11'
      
  // });

  
  // useEffect(() => {
  //   if (!map.current) return; // wait for map to initialize
  //     // My customization:
  //     // Allow fullscreen mode    
  //     map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));
  //     // Retrieve the user's location if they allow access
  //     map.addControl(new mapboxgl.GeolocateControl({
  //       positionOptions: {
  //       enableHighAccuracy: true
  //       },
  //       trackUserLocation: true,
  //       showUserHeading: true
  //       }))
  //   });
  //   };

  // Retrieve stations from
  // useEffect(() => {
  //     console.log("use effect")
  //     fetch("/stations")
  //         .then((res) => {
  //             console.log(res);
  //             res.json()
  //         })
  //         .then((json) => {
  //             // Store the station data in a state
  //             console.log(json);
  //             setStations(json.data);
  //             // Call the function that will add the stations to the map
  //             // addStations
  //             // Tell 
  //             // setLoaded(true);
  //         })
  // },[])



  // Add a point to the map
  // const addStations = () => {
      // stations.forEach((station) => {
      //     let marker = new mapboxgl.Marker()
      //     console.log(station.position)
      //     marker.setLngLat(station.position)
      //     marker.addTo(map);
      // })
  // }

  return (
    <Map />
  );
}

export default App;