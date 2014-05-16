var width = window.innerWidth -100,
    height = window.innerHeight;

var projection = d3.geo.mercator()
    .scale(700)
    .translate([1050, 100]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#cartogram").insert("svg:svg")
    .attr("width", width - 50)
    .attr("height", height -100);

var map = d3.select("#cartogram");

var state = svg.append("g")
    .attr("id", "state")
    .selectAll("path");

var topology,
    geometries,
    carto_features;

var carto = d3.cartogram()
    .projection(projection)
    .properties(function (d) { return d.properties; });

var vote_data = d3.map();

d3.json("data/maps/brasil.topo.json", function (data) {
    topology = data;
    geometries = topology.objects.states.geometries;

    var features = carto.features(topology, geometries);

    state = state.data(features)
        .enter()
        .append("path")
        .attr("class", "munic")
        .attr("id", function (d) {
            return d.properties.nome;
        })
        .attr("d", path);

    d3.select("#click_to_run").text("Clique AQUI para iniciar");
});

d3.csv("data/cartogram/brasil_def.csv", function (data) {
  data.forEach(function (d) {
      vote_data.set(d.STATE,[d.INDEX, d.NAME]);
  });
});

function do_update() {
    d3.select("#click_to_run").text("aguarde...");
    setTimeout(function () {
      
        carto.value(function (d) {
            return +vote_data.get(d.properties.id)[0];
        });
                
        if (carto_features === undefined) {
            carto_features = carto(topology, geometries).features;
        }

        state.data(carto_features)
            .transition()
            .duration(750)
            .attr("d", carto.path);
    }, 10);
}
