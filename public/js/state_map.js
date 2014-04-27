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
    .defer(d3.csv, "data/heatmap/coords.csv")
    .await(ready);

  function ready(error, states) {

    state.selectAll("path")
       .data(topojson.feature(states, states.objects.layer1).features)
     .enter().append("svg:path")
       .attr("d", path);

  } 

}
