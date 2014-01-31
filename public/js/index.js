function graph ( rate_file, data_file, color, input, output, balance) {

d3.selectAll('.map > svg').remove();

  var w = 740,
      h = 670;
  
  var projection = d3.geo.azimuthal()
      .mode("equidistant")
      .scale(3600)
      .translate([3100, -990]);
  
  var path = d3.geo.path()
      .projection(projection);
  
  var svg = d3.select(".map").insert("svg:svg", "h2")
      .attr("width", w)
      .attr("height", h);
  
  var state = svg.append("svg:g")
      .attr("id", "state")
      .attr("class", color);
  
  var colors = d3.scale.quantize()
      .range(colorbrewer[color][9]);
  
  var data;
  
  var rate;
  
  d3.select("input[type=checkbox]").on("change", function() {
    cells.classed("voronoi", this.checked);
  });
  
  //carrega arquivo com os valores das taxas
  d3.json("data/" + rate_file, function(file) {
    data = file;

    var legend = d3.select('#legend')
        .append('ul')
         .attr('class', 'list-inline');

    var keys = legend.selectAll('li.key')
        .data(colors.range());
    
    keys.enter().append('li')
        .attr('class', 'key')
        .style('border-top-color', String);

    //carrega o arquivo para desenhar o poligono
    d3.json("data/minas.json", function(collection) {
      
      //adiciona os dados na variável
      state.selectAll("path")
          .data(collection.features)
          .enter().append("svg:path")
          .attr("class", function(d) { 
            for (i in data) {
              if (data[i].id == d.properties.GEOCODIGO) {
                rate = Math.log(data[i].rate);
                break;
              };
            }
            return "q" + Math.min(8, ~~(rate * 9 / 12)) + "-9 cities";
          })
          .attr("d", path);
    });
  });
}
