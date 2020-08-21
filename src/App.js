import React, { Component } from 'react'
import './App.css'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import tokyo23 from './tokyo23.geojson'
import * as d3 from 'd3'
import axios from 'axios'
import wards from './wards.json'

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      colors : [
        '#78013c',
        '#e6002f',
        '#fe8801',
        '#f9d600',
        '#fafc00',
        '#b8fb3a',
        '#beefff',
        '#e5fffc',
        '#0095fe',
        '#045bff',
      ]
    }
  }
  componentDidMount() {
    
    var weatherData = new Map();
    var hoveredStateId = null;

    wards.wards.forEach(function (ward) {
      axios
      .get("https://api.openweathermap.org/data/2.5/weather?lat="+ward.lat+"&lon="+ward.lon+"&appid="+process.env.REACT_APP_MAPBOX_OPENWEATHER_API_KEY)
      .then((results) => {
        weatherData.set(ward.id, results);
        
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

    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', function () {
      d3.json(tokyo23).then(
        function (data) {
          for (const feature of data.features) {
            if (weatherData.has(feature.id)) {
              var item = weatherData.get(feature.id);
              feature["properties"] = {
                  "name": item.data.name,
                  "templature": Math.round((item.data.main.temp-273.15) * 10) / 10,
                  "weather": item.data.weather[0].main,
                  "humidity": item.data.main.humidity
                };
            } else {
              feature["properties"] = {
                  "name": "test",
                  "templature": 5,
                  "weather": "test",
                  "humidity": "10"
                };
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
                -5,
                '#045bff',
                0,
                '#0095fe',
                5,
                '#e5fffc',
                10,
                '#beefff',
                15,
                '#b8fb3a',
                20,
                '#fafc00',
                25,
                '#f9d600',
                30,
                '#fe8801',
                35,
                '#e6002f',
                40,
                '#78013c',
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

      map.on('click', 'tokyo23-fills', function(e) {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          '<h4>'+e.features[0].properties.name+'</h4><table><tbody><tr><td>weather</td><td>'+e.features[0].properties.weather+'</td></tr><tr><td>templature</td><td>'+e.features[0].properties.templature+'℃</td></tr><tr><td>humidity</td><td>'+e.features[0].properties.humidity+'%</td></tr></tbody></table>'
        )
        .addTo(map);
        });
    });
  }
  render() {
    return (
      <div>
        <div className={'map'} ref={e => (this.container = e)} />
        <div className='map-overlay top'>
          <div className='map-overlay-inner'>
            <h4>Templature</h4>
            <table>
              <tbody>
                {this.state.colors.map((color, index) => {
                  return (
                    <tr key={index}>
                      <td style={{backgroundColor: color}}></td>
                      <td style={{textAlign: "center"}}>{40-(index*5)+'℃'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

}

export default App