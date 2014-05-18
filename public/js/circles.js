var width = window.innerWidth -100,
    height = window.innerHeight;

var projection = d3.geo.mercator();

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#centered").insert("svg:svg")
    .attr("width", width - 50)
    .attr("height", height);

queue()
  .defer(d3.json, "data/maps/mun.topo.json" )
  .await(ready);

function ready(error, collection) {
 
  var fit = topojson.feature(collection, collection.objects.municipios);

  projection
      .scale(1)
      .translate([0, 0]);

  var b = path.bounds(fit),
      s = .75 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - 200 - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
      .scale(s)
      .translate(t);

  svg.selectAll("circle")
      .data(topojson.feature(collection, collection.objects.municipios).features)
    .enter().append("circle")
      .attr("class", "circleCity")
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("r", function(d) { return Math.sqrt(path.area(d) / Math.PI); });

}
