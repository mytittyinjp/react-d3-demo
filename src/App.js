import React, { Component } from 'react'
import './App.css'
import tokyo23 from './tokyo23.geojson'
import * as d3 from 'd3'; 

class App extends Component {
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
}

export default App