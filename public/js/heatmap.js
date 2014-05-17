var width = window.innerWidth -100,
    height = window.innerHeight;

var  numClasses = 9, radius = 9;

var hexbin = d3.hexbin()
    .size([width, height]);

var projection = d3.geo.mercator()
    .scale(700)
    .translate([1050, 100]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#heatmap").insert("svg:svg")
    .attr("width", width - 50)
    .attr("height", height -100);

var state = svg.append("svg:g")
    .attr("id", "state");

var circles = svg.append("svg:g")
    .attr("id", "circles");

var averageFunction = function(d) {
  var sum = 0;
  d.forEach(function (entry) {
    sum += entry[2];
  });
  return Math.floor(sum/d.length/1000)-1;
};

var positions = [], aux; 

queue()
  .defer(d3.json, "data/maps/brasil.topo.json" )
  .defer(d3.csv, "data/heatmap/coords.csv" )
  .await(ready);

function ready(error, collection, data) {
 
  aux = data

  state.selectAll("path")
      .data(topojson.feature(collection, collection.objects.states).features)
    .enter().append("svg:path")
    .attr("d", path);

  data.forEach(function(datum) {
    positions.push(projection([+datum.lot, +datum.lat]).concat(+datum.value));
  });

  var g = circles.selectAll("g")
      .data(data)
    .enter().append("svg:g");
  
  g.append("svg:circle")
      .attr("cx", function(d, i) { return positions[i][0]; })
      .attr("cy", function(d, i) { return positions[i][1]; })
      .attr("r", 1)
      .style("fill", "white")
      .attr("class", function(d) { return d.city; });

  drawHex(radius);
}

function drawHex (radius) {
      
  d3.select(".hexagons").remove();

  hexbin.radius(radius);

  svg.append("g")
      .attr("class", "hexagons YlOrRd")
    .selectAll("path")
      .data(hexbin(positions).sort(function(a, b) { return b.length - a.length; }))
    .enter().append("path")
      .attr("d", function(d) { return hexbin.hexagon(radius); })
      .attr("class", function(d)
      {
        var c = 'q' + ( (numClasses-1) - averageFunction(d)) + "-" + numClasses;
        return c;
      })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .on("mouseover", function(d) 
    { 
      d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2);

    })
    .on("mouseout", function(d)
    {
      d3.select(this).attr("stroke", "none");
    })
    .on("click", drawAuxHex);

}

function drawAuxHex () {
  RadarChart.draw("#centered", d, mycfg);
}
