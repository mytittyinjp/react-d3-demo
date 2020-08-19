import React, { Component } from 'react'
import './App.css'
import tokyo23 from './tokyo23.geojson'
import * as d3 from 'd3'; 

class App extends Component {
  componentDidMount() {
    const fill = {
      "13101": "red",
      "13102": "blue",
      "13103": "green",
      "13104": "orange",
      "13105": "blueviolet",
      "13106": "azure",
      "13107": "forestgreen",
      "13108": "tomato",
      "13109": "lightyellow",
      "13110": "yellow",
      "13111": "crimson",
      "13112": "forestgreen",
      "13113": "red",
      "13114": "skyblue",
      "13115": "palegoldenrod",
      "13116": "red",
      "13117": "maroon",
      "13118": "royalblue",
      "13119": "lawngreen",
      "13120": "darkblue",
      "13121": "darkmagenta",
      "13122": "cornsilk",
      "13123": "aqua"
    };
    const node = this.node
    d3.json(tokyo23).then(function(tokyo) {
      var width = 1000;
      var height = 600;
      var scale = 80000;
      var aProjection = d3.geoMercator()
          .center([139.69167, 35.68944])
          .translate([width/2, height/2])
          .scale(scale);
      var geoPath = d3.geoPath().projection(aProjection);
      var svg = d3.select(node).attr("width",width).attr("height",height);

      var map = svg.selectAll("path")
                .data(tokyo.features)
                .enter()
                .append("path")
                .attr("d", geoPath)
                .style("stroke", "#ffffff")
                .style("stroke-width", 0.1)
                .style("fill", function(d){return fill[d.id]});
 
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