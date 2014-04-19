var width = window.innerWidth,
    height = window.innerHeight;

var color = d3.time.scale()
    .domain([8, 13])
    .range(colorbrewer['RdYlBu'][11])
    .interpolate(d3.interpolateLab);

var hexbin = d3.hexbin()
    .size([width, height])
    .radius(8);

var projection = d3.geo.mercator()
    .scale(18000)
    .translate([2900, -650]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#heatmap").insert("svg:svg")
    .attr("width", width - 50)
    .attr("height", height -100);

var state = svg.append("svg:g")
    .attr("id", "state");

d3.csv("data/dic-minas-teste.csv", function(data) {
  data.forEach(function(d) {
    var p = projection(d);
    d[0] = p[0], d[1] = p[1];
  });

  d3.json("data/maps/mg.topo.json", function (error, collection) {
   
      state.selectAll("path")
          .data(topojson.feature(collection, collection.objects.layer1).features)
        .enter().append("svg:path")
        .attr("d", path);
  });

  svg.append("g")
      .attr("class", "hexagons")
    .selectAll("path")
      .data(hexbin(data).sort(function(a, b) { return b.length - a.length; }))
    .enter().append("path")
      .attr("d", function(d) { return hexbin.hexagon(7.8); })
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
