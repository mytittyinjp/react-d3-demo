git clone https://github.com/mytittyinjp/react-d3-demo.git
create-react-app react-d3-demo
cd react-d3-demo
touch .env
vim .gitignore
    .env
yarn add mapbox-gl
vim .env
    REACT_APP_MAPBOX_ACCESS_TOKEN="youraccesstoken"

add below code to index.js
    import mapboxgl from 'mapbox-gl';
    mapboxgl.accessToken =  process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

add below code to App.js
    import mapboxgl from 'mapbox-gl'
    import 'mapbox-gl/dist/mapbox-gl.css'
    import tokyo23 from './tokyo23.json' //geojson

add below code to App class in App.js
you can display mapbox

    componentDidMount() {
        let map = new mapboxgl.Map({
            container: this.container,
            style: 'mapbox://styles/mapbox/light-v10', //map style
            center: [139.69167, 35.68944], //map center latlon
            zoom: 10,
        });
    }
    render() {
        return <div className={'map'} ref={e => (this.container = e)} />
    }

add below code to componentDidMount in App.js
you can control zooming of map 
    map.addControl(new mapboxgl.NavigationControl()); 

add below code to componentDidMount in App.js
you can display polygones of tokyo23 geojson

    map.on('load', function() {
      map.addSource('tokyo23', {
        type: 'geojson', // source type(vecter,raster,raster-dem,geojson and else)
        data: tokyo23 // geojson file
      });
      map.addLayer({
        'id': 'tokyo23-layer',
        'type': 'fill', // layer type(fill,line,circle and else)
        'source': 'tokyo23', // source id
        'layout': {},
        'paint': {
          'fill-outline-color': '#3e6aa2',
          'fill-color': '#d6e1ef',
          'fill-opacity': 0.8
        }
      });
    });

reference site
https://docs.mapbox.com/mapbox-gl-js/api/
https://tech-blog.optim.co.jp/entry/2019/05/14/173000
https://github.com/niiyz/JapanCityGeoJson/blob/master/geojson/13/tokyo23.json
