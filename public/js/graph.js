var width = window.innerWidth,
    height = window.innerHeight;

var color = d3.scale.ordinal()
    .range(colorbrewer.Set3[12]);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>" + d.name + "</span>";
  })

var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "back-white");

var force = d3.layout.force()
    .charge(-70)
    .linkDistance( function(d) { return (d.value/300 * 15) } )
    .gravity([1])
    .size([width, height]);

var flow, focus;

svg.call(tip);

d3.json("data/data.json", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();
      flow = graph;

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.log(d.value)/4; })
      .style('opacity', function(d) {
              return d.target.module ? 0.2 : 0.3
                  });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return 1.5 * Math.sqrt(d.weight); })
      .style("fill", function(d) { return color(d.group); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .call(force.drag)
      .on('click', function(d) {
          if (focus === d) {
            force.charge(-70)
                 .linkDistance( function(d) { return (d.value/300 * 15) } )
                 .linkStrength(1)
                 .start();

            node.style('opacity', 1);
            link.style('opacity', function(d) {
                return d.target.module ? 0.6 : 0.1
            }) 
            focus = false;
          }
          else {
            focus = d;
  
            node.style('opacity', function(o) {
              o.active = connected(focus, o);
              return o.active ? 1: 0.1;
            })

            force.charge(function(o) {
                return (o.active ? -100 :-5);
            }).linkDistance(function(l) {
                return (l.source.active && l.target.active ? 100 : 20);
            }).linkStrength(function(l) {
                return (l.source === d || l.target === d ? 1 : 0);
            }).start();

            link.style('opacity', function(l, i) {
                return l.source.active && l.target.active ? 0.2 : 0.02
            })
          }
      });

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
             (n.source == t && n.target == s)
             }).length != 0;
  }
});
