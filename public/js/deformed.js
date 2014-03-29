var width = window.innerWidth,
    height = window.innerHeight;

var projection = d3.geo.azimuthal()
    .mode("stereographic")
    .scale(1300)
    .translate([1100, 100]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#deformed").insert("svg:svg")
    .attr("width", width - 50)
    .attr("height", height -100)
    .append("g");

var state = svg.append("svg:g")
    .attr("id", "state");

//carrega o arquivo para desenhar o poligono
d3.json("data/brasil.topo.json", function(error, collection) {
  state.selectAll("path")
      .data(topojson.feature(collection, collection.objects.counties).features)
    .enter().append("svg:path")
      .attr("d", path);
});
