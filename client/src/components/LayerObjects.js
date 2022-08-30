export const addRouteLayerObject = {
    id: 'point',
    type: 'circle',
    source: {
        type: 'geojson',
        data: {
        type: 'FeatureCollection',
        features: [
            {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: origin,
            }
            }
        ]
        }
    },
    paint: {
        'circle-radius': 20,
        'circle-color': '#3887be'
    }
};

