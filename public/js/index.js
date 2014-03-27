var w = 740,
    h = 670;

var projection = d3.geo.azimuthal()
    .mode("equidistant")
    .scale(3800)
    .translate([3300, -1030]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#maps").insert("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");

var state = svg.append("svg:g")
    .attr("id", "state");

var a;

//carrega o arquivo para desenhar o poligono
d3.json("data/minas.json", function(collection) {
  
  a = collection.features;

  state.selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
      .attr("d", path)
      .on("click", function(n) { alert ([n.properties.LATITUDE, n.properties.LONGITUDE]) });
});
