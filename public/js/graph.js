var width = 1256,
    height = 680;

var color = d3.scale.ordinal()
    .range(colorbrewer.Set3[12]);

var force = d3.layout.force()
    .charge(-100)
    .linkDistance( function(d) { return (d.value/300 * 15) } )
    .size([width, height]);

var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("data/data.json", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.log(d.value)/4; })
      .style("stroke", "#eaeaea");

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return 1.5 * Math.sqrt(d.weight); })
      .style("fill", function(d) { return color(d.group); })
      //.on("mouseover", function (d) { showTooltip(d); })
      //.on("mousemove", function (d) { moveTooltip(d); })
      //.on("mouseout", function (d) { hideTooltip(d); })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});
