var width = window.innerWidth -100,
    height = window.innerHeight;

var color = d3.time.scale()
    .domain([8, 13])
    .range(colorbrewer['RdYlBu'][11])
    .interpolate(d3.interpolateLab);

var hexbin = d3.hexbin()
    .size([width, height])
    .radius(3.5);

var projection = d3.geo.mercator()
    .scale(4500)
    .translate([1050, 150]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#heatmap").insert("svg:svg")
    .attr("width", width - 50)
    .attr("height", height -100);

var state = svg.append("svg:g")
    .attr("id", "state");

var circles = svg.append("svg:g")
    .attr("id", "circles");

d3.json("data/maps/brasil.topo.json", function (error, collection) {
 
    state.selectAll("path")
        .data(topojson.feature(collection, collection.objects.states).features)
      .enter().append("svg:path")
      .attr("d", path);
});

var positions = [], rate = [];

d3.csv("data/heatmap/coordsBrasil.csv", function(data) {

  data.forEach(function(datum) {
    positions.push(projection([+datum.lot, +datum.lat]));
    positions.concat(+datum.output);
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

  svg.append("g")
      .attr("class", "hexagons")
    .selectAll("path")
      .data(hexbin(positions).sort(function(a, b) { return b.length - a.length; }))
    .enter().append("path")
      .attr("d", function(d) { return hexbin.hexagon(3); })
      .style("fill", function(d) { return color(d3.median(d, function(d) { return +Math.log(100*d.output); })); })
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .on("mouseover", function(d) 
    { 
      d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2);

    })
    .on("mouseout", function(d)
    {
      d3.select(this).attr("stroke", "none");
    });

});
