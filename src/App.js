import React, { Component } from 'react'
import './App.css'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import tokyo23 from './tokyo23.geojson'
import * as d3 from 'd3'; 

class App extends Component {
  componentDidMount() {
    let map = new mapboxgl.Map({
        container: this.container,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [139.69167, 35.68944],
        zoom: 10,
    });
    map.on('load', function() {
      d3.json(tokyo23).then(
        function(data) {
          map.addSource('tokyo23', {
            type: 'geojson',
            data: data
          });
          map.addLayer({
            'id': 'tokyo23-layer',
            'type': 'fill',
            'source': 'tokyo23',
            'paint': {
              'fill-outline-color': '#3e6aa2',
              'fill-color': '#d6e1ef',
              'fill-opacity': 0.8
            }
          });
        }
      );
    });
  }
  render() {
      return <div className={'map'} ref={e => (this.container = e)} />
  }
   
}

export default App