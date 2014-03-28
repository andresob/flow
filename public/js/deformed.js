var w = 740,
    h = 670;

var projection = d3.geo.azimuthal()
    .mode("stereographic")
    .scale(1000)
    .translate([1000, 100]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#deformed").insert("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");

var state = svg.append("svg:g")
    .attr("id", "state");

var a;

//carrega o arquivo para desenhar o poligono
d3.json("data/brasil.json", function(collection) {
  
  a = collection.features;

  state.selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
      .attr("d", path);
});
