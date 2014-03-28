var w = 740,
    h = 670;

var projection = d3.geo.azimuthal()
    .mode("stereographic")
    .scale(5700)
    .translate([2700, -750]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").insert("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");

var state = svg.append("svg:g")
    .attr("id", "state");

//carrega o arquivo para desenhar o poligono
d3.json("data/minas.topo.json", function(error, collection) {
  state.selectAll("path")
      .data(topojson.feature(collection, collection.objects.state).features)
    .enter().append("svg:path")
      .attr("d", path)
      .on("click", function(n) { alert ([n.properties.LATITUDE, n.properties.LONGITUDE]) });
});
