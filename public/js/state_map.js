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
  
  var svg = d3.select("#map").insert("svg:svg")
      .attr("width", width)
      .attr("height", height -50);
      
  d3.select("#stateName").text(stateFile[3]).attr("class","animated fadeInLeft");
  
  state = svg.append("svg:g")
      .attr("id", "state");
  
  queue()
    .defer(d3.json, "data/maps/" + stateFile[2] + ".topo.json")
    .defer(d3.json, "data/states/" + stateFile[2] + ".csv")
    .await(ready);

  function ready(error, states, cities) {

    var positions = [], rate = [];

    state.selectAll("path")
       .data(topojson.feature(states, states.objects.layer1).features)
     .enter().append("svg:path")
       .attr("d", path);

    cities.forEach(function(city) {
      positions.push(projection([+city.lot, +city.lat]));
    });
  
    var g = circles.selectAll("g")
        .data(cities)
      .enter().append("svg:g");
    
    g.append("svg:circle")
        .attr("cx", function(d, i) { return positions[i][0]; })
        .attr("cy", function(d, i) { return positions[i][1]; })
        .attr("r", 1)
        .style("fill", "white")
        .attr("class", function(d) { return d.city; });

  } 

}
