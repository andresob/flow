var width = window.innerWidth -100,
    height = window.innerHeight;

var numClasses = 9, radius = 9;

var hexbin = d3.hexbin()
    .size([width, height]);

var projection = d3.geo.mercator();

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#heatmap").insert("svg:svg")
    .attr("width", width - 50)
    .attr("height", height);

var state = svg.append("svg:g")
    .attr("id", "state");

var averageFunction = function(d) {
  var sum = 0;
  d.forEach(function (entry) {
    sum += entry[2];
  });
  if (Math.floor(sum/d.length/1000) > 9)
    return 9;
  else
    return Math.floor(sum/d.length/1000);
};

var positions = [], aux, mun, hexI, hexA=[], hexB=[], hexC={}; 

queue()
  .defer(d3.json, "data/maps/mun.topo.json" )
  .defer(d3.json, "data/maps/brasil.topo.json" )
  .defer(d3.csv, "data/heatmap/coords.csv" )
  .await(ready);

function ready(error, circ, collection, data) {
 
  var fit = topojson.feature(collection, collection.objects.states);

  projection
      .scale(1)
      .translate([0, 0]);

  var b = path.bounds(fit),
      s = .75 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - 600 - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
      .scale(s)
      .translate(t);

  aux = data;
  mun = circ;

  state.selectAll("path")
      .data(topojson.feature(collection, collection.objects.states).features)
    .enter().append("svg:path")
    .attr("d", path);

  aux.forEach(function(datum) {
    positions.push(projection([+datum.lot, +datum.lat]).concat(+datum.imigrantes).concat(datum.axis));
  });

  drawHex(9);

}

function drawCircles () {

  var munC = svg.append("svg:g")
      .attr("id", "mun");

  munC.selectAll("g")
      .data(topojson.feature(mun, mun.objects.municipios).features)
    .enter().append("svg:circle")
      .attr("class", "circleCity")
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("r", function(d) { return Math.sqrt(path.area(d) / Math.PI); });

}

function drawHex (radius) {

  var circles = svg.append("svg:g")
      .attr("id", "circles");

  var g = circles.selectAll("g")
      .data(aux)
    .enter().append("svg:g");
  
  g.append("svg:circle")
      .attr("cx", function(d, i) { return positions[i][0]; })
      .attr("cy", function(d, i) { return positions[i][1]; })
      .attr("r", 1)
      .style("fill", "white")
      .attr("class", function(d) { return d.city; });

  d3.select(".hexagons").remove();

  hexbin.radius(radius);

  svg.append("g")
      .attr("class", "hexagons YlOrRd")
    .selectAll("path")
      .data(hexbin(positions).sort(function(a, b) { return b.length - a.length; }))
    .enter().append("path")
      .attr("d", function(d) { return hexbin.hexagon(radius); })
      .attr("class", function(d)
      {
        var c = 'q' + ( (numClasses) - averageFunction(d)) + "-" + numClasses;
        return c;
      })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .on("mouseover", function(d) 
    { 
      d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2);

    })
    .on("mouseout", function(d)
    {
      d3.select(this).attr("stroke", "none");
    })
    .on("click", function(d) {
      hexI = null;
      hexI = d3.select(this).data()[0].sort(function(a,b) { return b[2] - a[2]});
      drawAux(hexI);
    });

}

function drawAux (hexData) {

  hexA=[], hexB=[];

  hexData.forEach(function(datum) {
    hexC = {};
    hexC.axis = datum[3];
    hexC.value = +datum[2];
    hexB.push(hexC);
  });

  hexA.push(hexB);

  var mycfg = {
    w: 350,
    h: 350,
    maxValue: hexData[0][2],
    levels: 6,
    ExtraWidthX: 180
  }
 
  RadarChart.draw("#centered", hexA, mycfg);
  
}

d3.select(".pick.circ").on("click", function(d) {
  drawCircles();
  d3.select(".hexagons").remove();
  d3.select("#circles").remove();
  d3.select("#centered > svg").remove();
  d3.select("#rate").attr("class", "marginInfo animated hide");
});

d3.select(".pick.hex").on("click", function(d) {
  drawHex(9);
  d3.select("#mun").remove();
  d3.select("#rate").attr("class", "marginInfo animated fadeInDown");
});
