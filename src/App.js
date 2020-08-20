import React, { Component } from 'react'
import './App.css'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import tokyo23 from './tokyo23.geojson'
import * as d3 from 'd3'
import axios from 'axios'
import wards from './wards.json'

class App extends Component {

  componentDidMount() {

    var templatures = new Map();
    wards.wards.forEach(function(ward){
      axios
      .get("https://api.openweathermap.org/data/2.5/weather?lat="+ward.lat+"&lon="+ward.lon+"&appid="+process.env.REACT_APP_MAPBOX_OPENWEATHER_API_KEY)
      .then((results) => {
          templatures.set(ward.id, results.data.main.temp-273.15);
      })
      .catch((error) => {
        console.log(error);
      });
    });

    let map = new mapboxgl.Map({
      container: this.container,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [139.69167, 35.68944],
      zoom: 10,
    });
    var hoveredStateId = null;

    map.on('load', function () {
      d3.json(tokyo23).then(
        function (data) {
          for (const feature of data.features) {
            if(templatures.has(feature.id)){
              feature["properties"] = {"templature": templatures.get(feature.id)};
            }else{
              feature["properties"] = {"templature": 5};
            }
            
          }
          map.addSource('tokyo23', {
            type: 'geojson',
            data: data
          });
          map.addLayer({
            'id': 'tokyo23-fills',
            'type': 'fill',
            'source': 'tokyo23',
            'paint': {
              'fill-outline-color': 'white',
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'templature'],
                -20,
                '#800080',
                -15,
                '#010f3b',
                -10,
                '#01195b',
                -5,
                '#021e80',
                0,
                '#0443f9',
                5,
                '#0099fd',
                10,
                '#b7ebfe',
                15,
                '#fffff4',
                20,
                '#fefe98',
                25,
                '#fe9a01',
                30,
                '#ff2204',
                40,
                '#b90270'
              ],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.7
              ]
            }
          });
        }
      );

      map.on('mousemove', 'tokyo23-fills', function (e) {
        if (e.features.length > 0) {
          if (hoveredStateId) {
            map.setFeatureState(
              { source: 'tokyo23', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id;
          map.setFeatureState(
            { source: 'tokyo23', id: hoveredStateId },
            { hover: true }
          );
        }
      });

      map.on('mouseleave', 'tokyo23-fills', function () {
        if (hoveredStateId) {
          map.setFeatureState(
            { source: 'tokyo23', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
      });
    });
  }
  render() {
    return <div className={'map'} ref={e => (this.container = e)} />
  }

}

export default App