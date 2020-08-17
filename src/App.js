import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import './App.css'
import tokyo23 from './tokyo23.json'
import 'mapbox-gl/dist/mapbox-gl.css'

class App extends Component {
  componentDidMount() {
    let map = new mapboxgl.Map({
      container: this.container,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [139.69167, 35.68944],
      zoom: 10,
    });
    map.on('load', function() {
      map.addSource('tokyo23', {
        type: 'geojson',
        data: tokyo23
      });
      map.addLayer({
        'id': 'tokyo23-layer',
        'type': 'fill',
        'source': 'tokyo23',
        'layout': {},
        'paint': {
          'fill-outline-color': '#3e6aa2',
          'fill-color': '#d6e1ef',
          'fill-opacity': 0.8
        }
      });
    });
    map.addControl(new mapboxgl.NavigationControl()); 
  }

  render() {
    return <div className={'map'} ref={e => (this.container = e)} />
  }
}

export default App