defaultMap();

function defaultMap () {

  var width = window.innerWidth -100,
      height = window.innerHeight;

  var color = d3.scale.ordinal()
      .range(colorbrewer.RdYlBu[12]);
  
  var projection = d3.geo.collignon();
  
  var path = d3.geo.path()
      .projection(projection);
  
  var svg = d3.select("#map").insert("svg:svg")
      .attr("width", width - 50)
      .attr("height", height);
  
  var state = svg.append("svg:g")
      .attr("id", "state");
  
  var circles = svg.append("svg:g")
      .attr("id", "circles");

  var lines = svg.append("svg:g")
      .attr("id", "lines");

  
  var positions = []; 
  
  queue()
    .defer(d3.json, "data/maps/brasil.topo.json" )
    .defer(d3.csv, "data/heatmap/coords.csv" )
    .await(ready);
  
  function ready(error, collection, data) {
   
    var fit = topojson.feature(collection, collection.objects.states);
  
    projection
        .scale(1)
        .translate([0, 0]);
  
    var b = path.bounds(fit),
        s = .55 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - 400 - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
  
    projection
        .scale(s)
        .translate(t);
  
    state.selectAll("path")
        .data(topojson.feature(collection, collection.objects.states).features)
      .enter().append("svg:path")
      .attr("d", path);
  
    data.forEach(function(datum) {
      positions.push(projection([+datum.lot, +datum.lat]).concat(+datum.imigrantes).concat(+datum.emigrantes));
    });
  
    var g = circles.selectAll("g")
        .data(data)
      .enter().append("svg:g");
    
    g.append("svg:ellipse")
        .attr("cx", function(d, i) { return positions[i][0]; })
        .attr("cy", function(d, i) { return positions[i][1]; })
        .attr("rx", 2)
        .attr("ry", 1)
        .attr("stroke", "white")
        .style("stroke-width", "0.7")
        .style("fill", "none")
        .attr("class", function(d) { return d.city; });

    drawline(2, "#A50026");

    d3.select(".pick.emig").on("click", function(d) {
      d3.selectAll("#lines > g").remove();
      drawline(2, "#A50026");
    });
    
    d3.select(".pick.imig").on("click", function(d) {
      d3.selectAll("#lines > g").remove();
      drawline(3, "#AABBCC");
    });
  
    function drawline (mig, color) {

      var g = lines.selectAll("g")
          .data(data)
        .enter().append("svg:g");

      var value;
      
      var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<span>" + d.axis + /*":  " +  d.value +*/ "</span>";
          });

      g.call(tip);

      g.append("svg:line")
          .attr("x1", function(d, i) { return positions[i][0]; })
          .attr("y1", function(d, i) { return positions[i][1]; })
          .attr("x2", function(d, i) { return positions[i][0]; })
          .attr("y2", function(d, i) { return (positions[i][1] - positions[i][mig]/1000) })
          //.style("stroke", function(d) { return color(d.value)})
          .style("stroke", color)
          .style("stroke-width", 3)
          //.style("opacity", function(d,i) { return (1 -  positions[i][2]/10000)})
          .style("opacity", "0.35")
          .attr("class", function(d) { return d.city; })
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide);
    }
  }
}

function drawState (state) {

  d3.selectAll('#map > svg').remove();

  var stateFile = dicState (state);
  
  var width = 800,
      height = window.innerHeight;
  
  var projection = d3.geo.mercator();

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
  
  d3.select("#stateName").text(stateFile[1]).attr("class","animated fadeInLeft");
  
  queue()
    .defer(d3.json, "data/maps/" + stateFile[0] + ".topo.json")
    .defer(d3.csv, "data/states/" + stateFile[0] + ".csv")
    .defer(d3.csv, "data/migrations/" + stateFile[0] + ".csv")
    .await(ready);

  function ready(error, states, cities, migrations) {

    var fit = topojson.feature(states, states.objects.layer1);

    projection
        .scale(1)
        .translate([0, 0]);

    var b = path.bounds(fit),
        s = .65 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
        .scale(s)
        .translate(t);

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
