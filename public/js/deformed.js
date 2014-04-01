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
    .attr("height", height -100);

var map = d3.select("#deformed")

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

d3.json("data/brasil.topo.json", function (data) {
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

d3.csv("data/brasil_def.csv", function (data) {
  data.forEach(function (d) {
      vote_data.set(d.STATE,[d.INDEX, d.NAME]);
      console.log(vote_data);
  })
});

function do_update() {
    d3.select("#click_to_run").text("aguarde...");
    setTimeout(function () {
      
        carto.value(function (d) {
            return +vote_data.get(d.properties["id"])[0];
        });
                
        if (carto_features == undefined) {
            carto_features = carto(topology, geometries).features;
        }

        state.data(carto_features)
            .transition()
            .duration(750)
            .attr("d", carto.path);
    }, 10);
}
