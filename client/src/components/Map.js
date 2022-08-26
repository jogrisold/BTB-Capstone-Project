import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

// const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

// required by mabox
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

// my mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug';

 
const Map = () => {
    // *****************************************************
    // Initial work:
    // *****************************************************
    // const [stations, setStations] = useState([]);
    // mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug';
    // const map = new mapboxgl.Map({
    //     container: 'map',
    //     style: 'mapbox://styles/mapbox/streets-v11'
    // });

    // // Retrieve the user's location if they allow access
    // map.addControl(new mapboxgl.GeolocateControl({
    //     positionOptions: {
    //     enableHighAccuracy: true
    //     },
    //     trackUserLocation: true,
    //     showUserHeading: true
    //     }))


    // // Retrieve stations from
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
    

    
    // // Add a point to the map
    // // const addStations = () => {
    //     stations.forEach((station) => {
    //         let marker = new mapboxgl.Marker()
    //         console.log(station.position)
    //         marker.setLngLat(station.position)
    //         marker.addTo(map);
    //     })
    // // }

    // *****************************************************
    // Post react implementation
    // *****************************************************

    // *****************************************************
    // States required by mapbox base
    // *****************************************************
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [lng, setLng] = useState(-73.5674);
    const [lat, setLat] = useState(45.5019);
    const [zoom, setZoom] = useState(9);

    // *****************************************************
    // States for customization
    // *****************************************************
    const [mapInit, setMapInit] = useState(false);

    // *****************************************************
    // useEffects required by mapbox base - DO NOT EDIT
    // *****************************************************
    // Initialize the map
    useEffect(() => {
        if (mapRef.current) return; // initialize map only once
            mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        // Set the map initialization state to true,
        // which will trigger our customization useEffect
        setMapInit(true);
    },[]);
    // Store the new co-ordinates 
    useEffect(() => {
        if (!mapRef.current) return; // wait for map to initialize
        mapRef.current.on('move', () => {
            setLng(mapRef.current.getCenter().lng.toFixed(4));
            setLat(mapRef.current.getCenter().lat.toFixed(4));
            setZoom(mapRef.current.getZoom().toFixed(2));
            
        });
    },[]);
    // *****************************************************
    // Mapbox essentials end
    // *****************************************************


    // Customization useEffect to avoid multiple elements 
    useEffect(() => {
        // wait for map to initialize
        if (mapInit === true) {
// TO DO: Write am if statement to only render the followingon desktop
// TO DO: if(screenwidth >700px){}

            // Add navigation + / - for easier desktop useability
            mapRef.current.addControl(new mapboxgl.NavigationControl());
            
        } 
    },[mapInit]);
 


    // Allow fullscreen mode    
    // mapRef.addControl(new mapboxgl.FullscreenControl({container: mapContainer.current}));

    return(
             <div>
                <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
                <div ref={mapContainer} className="map-container" />
            </div>
    )
};

export default Map;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
`;
const Mapbox = styled.div`
    
`;