var width = window.innerWidth,
    height = window.innerHeight;

var projection = d3.geo.mercator()
    .scale(4600)
    .translate([1100, 100]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#heatmap").insert("svg:svg")
    .attr("width", width - 50)
    .attr("height", height -100);

var state = svg.append("svg:g");

d3.json("data/maps/brasil.topo.json", function (error, collection) {
 
    state.selectAll("path")
        .data(topojson.feature(collection, collection.objects.states).features)
      .enter().append("svg:path")
      .attr("d", path);

});
