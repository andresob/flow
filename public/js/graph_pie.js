function pieGraph (total, unused) {

  d3.select("#pie  > svg").remove();

  var data = [total,unused ];

  var color = ["#ef8a62", "#67a9cf"];
  
  var width = 220,
      height = 220,
      radius = Math.min(width, height) / 2;
  
  var pie = d3.layout.pie()
      .sort(null);
  
  var arc = d3.svg.arc()
      .innerRadius(radius - 65)
      .outerRadius(radius - 50);
  
  var content = d3.select("#pie").append("svg:svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  var path = content.selectAll("path")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", function(d, i) { return color[i]; })
      .attr("d", arc);
  
  var center_group = content.append("svg:g")
      .attr("class", "ctrGroup")
      .attr("transform", "translate(0,0)");
  
  var pieLabel = center_group.append("svg:text")
      .attr("dy", ".35em").attr("class", "chartLabel")
      .attr("text-anchor", "middle")
      .text((data[1]/data[0]).toFixed(4) * 100 + "%");
  
}
