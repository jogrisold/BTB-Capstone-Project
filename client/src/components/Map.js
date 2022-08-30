import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

// const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

// required by mabox
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import NavSearch from "./NavSearch";
import { addRouteLayerObject } from "./LayerObjects";

// my mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug';

 
const Map = () => {
    // *****************************************************
    // States required by mapbox base
    // *****************************************************
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [lng, setLng] = useState(-73.5674); // !!!! Need to gain these from user 
    const [lat, setLat] = useState(45.5019); // !!!! location or input city form
    const [zoom, setZoom] = useState(9);

    
    // *****************************************************
    // States for customization
    // *****************************************************
    // Create a state to hold map initialization for easier
    // useEffect customization implementation
    const [mapInit, setMapInit] = useState(false);
    // Create a state to hold the data from the backend
    // returning the bike station data
    const [bikeStations, setBikeStations] = useState([]);
    // For rendering the waypoints only once, and only after data 
    // has been fetched
    const [bikeDataRetrieved, setBikeDataRetrieved] = useState(false);
    // Create a state to hold the markers added to the map to remove 
    // them on submission of addRoute
    const [currentMarkers, setCurrentMarkers] = useState([]);
    
    // set a state for origin and destination, or you could use a useContext file

    // console.log('33: start of consts:' + bikeDataRetrieved, mapInit);

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
        // console.log('line 50: mapinitialization end:' + bikeDataRetrieved, mapInit);
    },[]);
    // Store the new co-ordinates 
    useEffect(() => {
        if (!mapRef.current) return; // wait for map to initialize
        mapRef.current.on('move', () => {
            setLng(mapRef.current.getCenter().lng.toFixed(4));
            setLat(mapRef.current.getCenter().lat.toFixed(4));
            setZoom(mapRef.current.getZoom().toFixed(2));
            // console.log('59: end of store co-ordinates:' + bikeDataRetrieved, mapInit);
        });
    },[]);
    // *****************************************************
    // Mapbox essentials end
    // *****************************************************

    // Retrieve stations from backend
    useEffect(() => {
        fetch("/stations")
            .then((res) => res.json())
            .then((json) => {
                // Store the station data in a state
                setBikeStations(json.data);
                // Set a state to trigger the bikeStations.map useEffect
                // in order to render the waypoints on the map
                setBikeDataRetrieved(true);
            });
        },[])

    // Customization useEffect to avoid multiple elements 
    useEffect(() => {
        // console.log('81: customization useeffect start');
        // wait for map to initialize
        if (mapInit === true) {
            // console.log('84: mapinit true passes');
            // Retrieve the user's location if they allow access
            mapRef.current.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
                }))

            // Allow fullscreen mode    
            mapRef.current.addControl(new mapboxgl.FullscreenControl({container: mapContainer.current}));

            //!!!!!!!!!!!!!!!!!!!  */
            // TO DO: Write am if statement to only render the followingon desktop
            // TO DO: if(screenwidth >700px){}
            //!!!!!!!!!!!!!!!!!!! */

            // Add navigation + / - for easier desktop useability
            mapRef.current.addControl(new mapboxgl.NavigationControl());
        }
        //  console.log('108: customization useEffect end, BikeDataRetrieved:' + bikeDataRetrieved, mapInit);
    },[mapInit]);
    // console.log('122, directions: ' + directions.waypoints[0])
    // console.log('109: just before bikestaions.map:' + bikeDataRetrieved, mapInit);
        
    // Add bike stations
    useEffect(()=>{
        // 112: bikestations triggered
        // Check that the station data has been retrieved successfully
        // in the fetch above, and that the map has been rendered
        if (bikeDataRetrieved === true && mapInit === true){
            bikeStations.forEach((station) => {
                let marker = new mapboxgl.Marker()
                marker.setLngLat(station.position);
                marker.addTo(mapRef.current);
                // Store the markers in an array in order to clear the map 
                // when a user submits getDirections and it calls removeMarkers();
                setCurrentMarkers(currentMarkers =>[...currentMarkers, marker])
            })
            // Set the retrieval trigger false to avoid
            // additional re-rendering on map navigation
            setBikeDataRetrieved(false);
        }
    },[bikeDataRetrieved])

    // Create a function that will remove all markers when a user submits the form
    // in NavSearch, triggering getDirections();
    const removeMarkers = () => {
        console.log("removemarkers starts")
        if (currentMarkers!==null) {
            for (var i = currentMarkers.length - 1; i >= 0; i--) {
              currentMarkers[i].remove();
            }
        }
    }
       
    // Create a function to make a directions request
    const getRoute = async(origin, destination) => {
        console.log("getroute starts")
        // make a directions request using cycling profile
        // an arbitrary origin, will always be the same
        // only the destination or destination will change
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/cycling/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
            { method: 'GET' }
        );
        const json = await query.json();
        const data = json.routes[0];
        const route = data.geometry.coordinates;
        const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: route
        }
        };
        // if the route already exists on the map, we'll reset it using setData
        if (mapRef.current.getSource('route')) {
        mapRef.current.getSource('route').setData(geojson);
        }
        // otherwise, we'll make a new request
        else {
            mapRef.current.addLayer({
                id: 'route',
                type: 'line',
                source: {
                type: 'geojson',
                data: geojson
                },
                layout: {
                'line-join': 'round',
                'line-cap': 'round'
                },
                paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
                }
            });
        }
    // add turn instructions here at the destination - mapbox next steps
    }
  
    // Define a function to add the route to the map 
    // as a mapbox layer
    const addRouteLayer = (origin, destination) =>{
        // Call the function that returns the route
        // getRoute(origin, destination);
        getRoute(origin, destination);
        
        // Add origin point to the map
        mapRef.current.addLayer(addRouteLayerObject);
    // this is where the code from the next step will go
    };

    // Create a function that will center the map on the 
    // origin when the user submits the getDirections form
    const centerMapOnOrigin = (origin, destination) => {
        const start = {
            center: destination,
            zoom: 1,
            pitch: 0,
            bearing: 0
            };
        const end = {
            center: origin,
            zoom: 16.5,
            bearing: 0,
            pitch: 0
        };
  
            let isAtStart = true;
             
            const target = isAtStart ? end : start;
            isAtStart = !isAtStart;
             
            mapRef.current.flyTo({
            ...target, // Fly to the selected target
            duration: 10000, // Animate over 10 seconds
            essential: true // This animation is considered essential with
            //respect to prefers-reduced-motion
            });
    }

    return(
                <Wrapper>
                <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
                <NavSearch 
                    bikeStations = {bikeStations}
                    addRouteLayer = {addRouteLayer}
                    mapboxgl = {mapboxgl}
                    removeMarkers = {removeMarkers}
                    centerMapOnOrigin = {centerMapOnOrigin}
                />
                <MapContainer ref={mapContainer} className="map-container" />
            </Wrapper>
    )
};
export default Map;

const Wrapper = styled.div`
    
`;
const Mapbox = styled.div`
    
`;

const MapContainer = styled.div`
    height: 900px;
`;