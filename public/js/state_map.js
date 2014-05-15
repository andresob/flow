function drawState (state) {

  d3.selectAll('#map > svg').remove();

  var stateFile = dicState (state);
  
  var width = 800,
      height = window.innerHeight;
  
  var projection = d3.geo.mercator()
      .scale(stateFile[0])
      .translate(stateFile[1]);

  var path = d3.geo.path()
      .projection(projection);

  var voronoi = d3.geom.voronoi()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });
  
  var svg = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height);
  
  state = svg.append("svg:g")
        .attr("class", "states state-borders");
  
  d3.select("#stateName").text(stateFile[3]).attr("class","animated fadeInLeft");
  
  queue()
    .defer(d3.json, "data/maps/" + stateFile[2] + ".topo.json")
    .defer(d3.csv, "data/states/" + stateFile[2] + ".csv")
    .defer(d3.csv, "data/migrations/" + stateFile[2] + ".csv")
    .await(ready);

  function ready(error, states, cities, migrations) {
    var cityById = d3.map(),
        positions = [];
  
    cities.forEach(function(d) {
      cityById.set(d.iata, d);
      d.outgoing = [];
      d.incoming = [];
    });
  
    migrations.forEach(function(migration) {
      var source = cityById.get(migration.origin),
          target = cityById.get(migration.destination),
          link = {source: source, target: target};
      source.outgoing.push(link);
      target.incoming.push(link);
    });
  
    cities = cities.filter(function(d) {
      if (d.count = Math.max(d.incoming.length, d.outgoing.length)) {
        d[0] = +d.longitude;
        d[1] = +d.latitude;
        var position = projection(d);
        d.x = position[0];
        d.y = position[1];
        return true;
      }
    });
  
    voronoi(cities)
        .forEach(function(d) { d.point.cell = d; });
  
    state.selectAll("path")
         .data(topojson.feature(states, states.objects.layer1).features)
       .enter().append("svg:path")
         .attr("d", path);
  
    var city = svg.append("g")
        .attr("class", "cities")
      .selectAll("g")
        .data(cities.sort(function(a, b) { return b.count - a.count; }))
      .enter().append("g")
        .attr("class", "city");
  
    city.append("path")
        .attr("class", "city-cell")
        .attr("d", function(d) { return d.cell.length ? "M" + d.cell.join("L") + "Z" : null; })
        .on("mouseover", function(d) {
          d3.select(".city").text("Cidade: " + d.name);
          d3.select(".cod").text("Código: " + d.iata);
          d3.select(".lat").text("Latitude: " + d.latitude);
          d3.select(".long").text("Longitude: " + d.longitude);
        });

  
    city.append("g")
        .attr("class", "city-arcs")
      .selectAll("path")
        .data(function(d) { return d.outgoing; })
      .enter().append("path")
        .attr("d", function(d) { 
            var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + 
              d.source.x + "," + 
              d.source.y + "A" + 
              dr + "," + dr + " 0 0,1 " + 
              d.target.x + "," + 
              d.target.y;
        });
  
    city.append("circle")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("r", function(d, i) { return Math.sqrt(d.count); });
  
  }

}
