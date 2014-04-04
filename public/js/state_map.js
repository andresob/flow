function drawState (state) {

  d3.selectAll('#map > svg').remove();

  var stateFile = dicState (state);

  var width = window.innerWidth,
      height = window.innerHeight;
  
  var projection = d3.geo.mercator()
      .scale(stateFile[0])
      .translate(stateFile[1]);
  
  var path = d3.geo.path()
      .projection(projection);
  
  var svg = d3.select("#map").insert("svg:svg")
      .attr("width", width - 50)
      .attr("height", height -50);
      
  svg.append("svg:svg")
    d3.select("#stateName").text(stateFile[3]).attr("class","animated fadeInLeft");
  
  var state = svg.append("svg:g")
      .attr("id", "state");
  
  //carrega o arquivo para desenhar o poligono
  d3.json("data/maps/" + stateFile[2] + ".topo.json", function(error, collection) {
    state.selectAll("path")
        .data(topojson.feature(collection, collection.objects.layer1).features)
      .enter().append("svg:path")
        .attr("d", path)
        .on("click", function(n) { alert (n.properties.NM_MUNICIP) });
  });

}
