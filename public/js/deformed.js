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

var state = svg.append("g")
    .attr("id", "state")
    .selectAll("path");

var topology,
    geometries,
    carto_features;

var carto = d3.cartogram()
    .projection(projection)
    .properties(function (d) { return d.properties; });

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

    d3.select("#click_to_run").text("click here to run");
        console.log(carto_features);
});

function do_update() {
    d3.select("#click_to_run").text("thinking...");
    setTimeout(function () {

        if (carto_features == undefined) {
            carto_features = carto(topology, geometries).features;
        }

        state.data(carto_features)
            .transition()
            .duration(750)
            .attr("d", carto.path);
    }, 10);
}
