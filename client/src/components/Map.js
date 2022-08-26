import { useEffect, useState } from "react";
import styled from "styled-components";

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

 
const Map = () => {

    const [stations, setStations] = useState([]);
    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11'
        
    });

    // Retrieve the user's location if they allow access
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
        }))

    // Allow fullscreen mode    
    map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));

    // Retrieve stations from
    useEffect(() => {
        fetch("/stations")
        .then((res) => res.json())
        .then((data) => {
            // Store the station data in a state
            setStations(data.data)
            // Call the function that will add the stations to the map
            // addStations
            // Tell 
            // setLoaded(true);
        })
    },[])
    

    
    // Add a point to the map
    // const addStations = () => {
        stations.forEach((station) => {
            let marker = new mapboxgl.Marker()
            console.log(station.position)
            marker.setLngLat(station.position)
            marker.addTo(map);
        })
    // }

    // mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug';
    // const mapbox = new mapboxgl.Map({
    //     container: 'mapboxid',
    //     style: 'mapbox://styles/mapbox/streets-v11'
    // });

    return(
        <Wrapper>

            Map React Component
            {/* <div id='mapboxid' style='width: 400px; height: 300px;'></div> */}
            {/* <div id='map' style='width: 400px; height: 300px;'></div>
      <script>{

      mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ncmlzb2xkIiwiYSI6ImNsNnV2Nm1zbTIxemIzanRlYXltNnhjYW0ifQ.wneEVyaaMSgq9bm_gD-Eug'
      const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11'
      });
      } */}
      {/* </script> */}
        </Wrapper>
    )
};

export default Map;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
`;
const Mapbox = styled.div`
    
`;