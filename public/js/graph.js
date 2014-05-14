var width = window.innerWidth - 100,
    height = window.innerHeight -20;

var color = d3.scale.ordinal()
    .range(colorbrewer.Set3[12]);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>" + d.n + "</span>";
  });

var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "back-white");

    svg.append("svg:defs").selectAll("marker")
        .data(["end"])
      .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
      .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

var force = d3.layout.force()
    .charge(-150)
    .linkDistance( function(d) { return (d.v/200 * 15); } )
    .gravity([1])
    .size([width, height]);

var flow, focus, total, unused;

svg.call(tip);

queue()
  .defer(d3.json, "data/graph/data.json")
  .await(ready);

function ready(error, graph) {

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();
      flow = graph;

  var link = svg.append("svg:g").selectAll("path")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.log(d.v)/4; })
      .style('opacity', function(d) { return d.target.module ? 0.2 : 0.3; });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return 2 * Math.sqrt(d.weight); })
      .style("fill", function(d) { return color(d.g); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .call(force.drag)
      .on('click', function(d) {
          if (focus === d) {
            force.charge(-150)
                 .linkDistance( function(d) { return (d.v/200 * 15); } )
                 .linkStrength(1)
                 .start();

            node.style('opacity', 1);
            link.style('opacity', function(d) {
                return d.target.module ? 0.6 : 0.1;
            })
            .attr("marker-end", "none");
            focus = false;
          }
          else {
            focus = d;
  
            node.style('opacity', function(o) {
              o.active = connected(focus, o);
              return o.active ? 1: 0.1;
            });

            force.charge(function(o) {
                return (o.active ? -200 :-5);
            }).linkDistance(function(l) {
                return (l.source.active && l.target.active ? 140 : 20);
            }).linkStrength(function(l) {
                return (l.source === d || l.target === d ? 1 : 0);
            }).start();

            link.style('opacity', function(l, i) {
                return l.source.active && l.target.active ? 0.2 : 0.02;
            })
            .attr("marker-end", "url(#end)");
          }
      });

  node.append("title")
      .text(function(d) { return d.n; });

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
    height = window.innerHeight;
    svg.attr("width", width)
       .attr("height", height);
    force
       .resume();
  }

  function connected(s, t) {
    return flow.links.filter( function(n) {
      return (s === t) ||
             (n.source == s && n.target == t) ||
             (n.source == t && n.target == s);
             }).length !== 0;
  }

  d3.select("input[type=checkbox]").on("change", function() {
    var n = d3.selectAll('.node').filter(function(n) { return n.weight == 0; });
    if (d3.select("#check").node().checked) {
      n.attr("r", "2");
    }
    else {
      node.attr("r", function(d) { return 2 * Math.sqrt(d.weight); })
    }
  });
  
  unused = flow.nodes.filter(function(n) { return n.weight == 0; }).length;
  total = flow.nodes.length;

  d3.select("#rate input").on("change", function() {
    d3.select("#rate input").property("v");
  });

}
