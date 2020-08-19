****************************
about mapbox
****************************

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

****************************
about d3
****************************
yarn add d3

rename tokyo.json to tokyo.geojson

add below code to App.js
    import tokyo23 from './tokyo23.geojson'
    import * as d3 from 'd3'; 

add below code to App class in App.js
you can display GIS data

  componentDidMount() {
    const node = this.node
    d3.json(tokyo23).then(function(japan) {
      var width = 1000;
      var height = 600;
      var scale = 80000;
      var aProjection = d3.geoMercator()
          .center([139.69167, 35.68944])
          .translate([width/2, height/2])
          .scale(scale);
      var geoPath = d3.geoPath().projection(aProjection);
      var svg = d3.select(node).attr("width",width).attr("height",height);

      var map = svg.selectAll("path").data(japan.features)
        .enter()
        .append("path")
          .attr("d", geoPath)
          .style("stroke", "#ffffff")
          .style("stroke-width", 0.1)
          .style("fill", "#5EAFC6");
 
      var zoom = d3.zoom().on('zoom', function(){
          aProjection.scale(scale * d3.event.transform.k);
          map.attr('d', geoPath);
      });
      svg.call(zoom);

      var drag = d3.drag().on('drag', function(){
          var tl = aProjection.translate();
          aProjection.translate([tl[0] + d3.event.dx, tl[1] + d3.event.dy]);
          map.attr('d', geoPath);
      });
      map.call(drag);
    });
  }

  render() {
    return <svg ref={node => this.node = node}></svg>
  }

modified fill style
you can change fill color for each data

    var map = svg.selectAll("path")
            .data(tokyo.features)
            .enter()
            .append("path")
            .attr("d", geoPath)
            .style("stroke", "#ffffff")
            .style("stroke-width", 0.1)
            .style("fill", function(d){return fill[d.id]});

reference site 
https://github.com/niiyz/JapanCityGeoJson
https://qiita.com/sand/items/422d4fab77ea8f69dfdf