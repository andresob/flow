var width = window.innerWidth -100,
    height = window.innerHeight;

var projection = d3.geo.mercator()
    .scale(4500)
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

queue()
  .defer(d3.json, "data/maps/brasil.topo.json")
  .defer(d3.csv, "data/cartogram/brasil_def.csv")
  .await(ready);

function ready(error, collection, def) {

    //var fit = topojson.feature(collection, collection.objects.states);

    //projection
    //    .scale(1)
    //    .translate([0, 0]);

    //var b = path.bounds(fit),
    //    s = .65 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
    //    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    //projection
    //    .scale(s)
    //    .translate(t);

    topology = collection;
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

    def.forEach(function (d) {
        vote_data.set(d.STATE,[d.INDEX, d.NAME]);
    });

    d3.select("#click_to_run").text("Clique AQUI para iniciar");
}

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
