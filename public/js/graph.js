var width = window.innerWidth,
    height = (window.innerHeight - 18);

var color = d3.scale.ordinal()
    .range(colorbrewer.Set3[12]);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>" + d.name + "</span>";
  })

var force = d3.layout.force()
    .charge(-70)
    .linkDistance( function(d) { return (d.value/300 * 15) } )
    .size([width/1.5, height/1.2]);

var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.call(tip);

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
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  resize();
  d3.select(window).on("resize", resize);

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
  
  function resize() {
    width = window.innerWidth;
    height = (window.innerHeight - 18);
    svg.attr("width", width)
       .attr("height", height);
    force
       .size([width, height])
       .resume();
  }

});
