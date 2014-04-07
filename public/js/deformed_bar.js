var width = 300,
    height = 400;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], '.1');

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>" + d.NAME + ":" + d.INDEX + "</span>";
  });

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "%");

var svg = d3.select("#bar").append("svg")
    .attr("width", width ) 
    .attr("height", height) 
  .append("g");

svg.call(tip);

d3.csv("data/brasil_def.csv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.STATE; }));
  y.domain([0, d3.max(data, function(d) { return d.INDEX; })]);

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.STATE); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.INDEX); })
      .attr("height", function(d) { return height - y(d.INDEX); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .attr("transform","rotate(90 200 200)");

});

function type(d) {
  d.INDEX = +d.INDEX;
  return d;
}
