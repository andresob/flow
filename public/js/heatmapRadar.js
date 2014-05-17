var w = 500,
  h = 500;

//Data
var d = [
      [
      {axis:"Email",value:0.48},
      {axis:"Social Networks",value:0.41},
      {axis:"View Shopping sites",value:0.29},
      {axis:"Paying Online",value:0.11},
      {axis:"Buy Online",value:0.14},
      {axis:"Stream Music",value:0.05},
      {axis:"Other",value:0.07},
      {axis:"Use less Once week",value:0.17}
      ]
    ];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 1,
  levels: 6,
  ExtraWidthX: 300
}

var radar = d3.select('#centered')
  .selectAll('radar')
  .append('svg')
  .attr("width", w+300)
  .attr("height", h)

//Create the title for the legend
var text = svg.append("text")
  .attr("class", "title")
  .attr('transform', 'translate(90,0)') 
  .attr("x", w - 70)
  .attr("y", 10)
  .attr("font-size", "12px")
  .attr("fill", "#404040");
