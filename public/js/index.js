function graph ( rate_file, data_file, color, input, output, balance) {

d3.selectAll('body > svg').remove();
d3.selectAll('#legend > ul').remove();

  var w = 740,
      h = 670;
  
  var projection = d3.geo.azimuthal()
      .mode("equidistant")
      .scale(3800)
      .translate([3300, -1030]);
  
  var path = d3.geo.path()
      .projection(projection);
  
  var svg = d3.select("body").insert("svg:svg", "h2")
      .attr("width", w)
      .attr("height", h);
  
  var state = svg.append("svg:g")
      .attr("id", "state")
      .attr("class", color);
  
  var circles = svg.append("svg:g")
      .attr("id", "circles");
  
  var cells = svg.append("svg:g")
      .attr("id", "cells");

  var colors = d3.scale.quantize()
      .range(colorbrewer[color][9]);
  
  var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
  
  var data;
  
  var rate;
  
  d3.select(".sedes").on("change", headquarters);
  d3.select(".links").on("change", links);
  
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
            return "q" + Math.min(8, ~~(rate * 9 / 12)) + "-9";
          })
          .attr("d", path)
          .on("mouseover", function(d) {
                var title = d3.select("#subtitle")
                        .text(d.properties.NOME);
          });
    
    });
    
    //carrega arquivo com as distribuições dos fluxos
    d3.csv("data/" + data_file, function(migrations) {
      var linksByOrigin = {},
          countByChange = {},
          locationByCity = {},
          positions = [];
    
      var arc = d3.geo.greatArc()
          .source(function(d) { return locationByCity[d.source]; })
          .target(function(d) { return locationByCity[d.target]; });
    
      migrations.forEach(function(migration) {
        var origin = migration.origin,
            destination = migration.destination,
            links = linksByOrigin[origin] || (linksByOrigin[origin] = []);
        links.push({source: origin, target: destination});
        countByChange[origin] = (countByChange[origin] || 0) + 1;
        countByChange[destination] = (countByChange[destination] || 0) + 1;
      });
    
      //carrega arquivo com as coordenadas das sedes municipais
      d3.csv("data/dic-minas.csv", function(cities) {
    
        //considera somente cidades com mais de uma migracao
        cities = cities.filter(function(city) {
          if (countByChange[city.iata]) {
            var location = [+city.longitude, +city.latitude];
            locationByCity[city.iata] = location;
            positions.push(projection(location));
            return true;
          }
        });
    
        var polygons = d3.geom.voronoi(positions);
    
        var g = cells.selectAll("g")
            .data(cities)
          .enter().append("svg:g")
            .call(zoom);
    
        //desenha as celulas e ativa as informações do municipios
        g.append("svg:path")
            .attr("class", "cell")
            .attr("d", function(d, i) { return "M" + polygons[i].join("L") + "Z"; })
            .on("mouseover", function(d) { 
                d3.select("#city").text(d.city);
                d3.select("#cod").text(d.iata);
                d3.select("#lat").text("Latitude: " + d.latitude);
                d3.select("#log").text("Longitude: " + d.longitude);
                d3.select("#meso").text("Mesorregião: " + d.meso + " (" + d.cod_meso + ")");
                d3.select("#micro").text("Microrregião: " + d.micro + " (" + d.cod_micro + ")");
                d3.select("#input").text("Entrada: " + d[input]);
                d3.select("#output").text("Saída: " + d[output]);
                d3.select("#balance").text("Saldo: " + d[balance]);
            });
    
        //desenha os links
        g.selectAll("path.arc")
            .data(function(d) { return linksByOrigin[d.iata] || []; })
          .enter().append("svg:path")
            .attr("class", "arc")
            .attr("stroke", "#08306b")
            .attr("stroke-width", function(d) { return countByChange[d.iata];})
            .attr("d", function(d) { return path(arc(d)); });
    
        //desenha os circulos
        circles.selectAll("circle")
            .data(cities)
          .enter().append("svg:circle")
            .attr("class", "circles")
            .attr("fill", "#c64250")
            .attr("cx", function(d, i) { return positions[i][0]; })
            .attr("cy", function(d, i) { return positions[i][1]; })
            .attr("r", function(d, i) { return Math.log(countByChange[d.iata]); })
            .sort(function(a, b) { return countByChange[b.iata] - countByChange[a.iata]; });
  
      });
    });
  });

  //zoom function
  function zoomed() {
    state.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    circles.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    cells.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }  

  //headquarters function
  function headquarters() {
    alert("bla");
  }

  //links function
  function links() {
    alert("bla");
  }

}
