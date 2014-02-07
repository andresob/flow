function graph ( rate_file, data_file, color, input, output, balance) {

  d3.selectAll('main > svg').remove();

  var w = 740,
      h = 640;
  
  var projection = d3.geo.azimuthal()
      .mode("equidistant")
      .scale(3800)
      .translate([3300, -1030]);
  
  var path = d3.geo.path()
      .projection(projection);

  var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
  
  var svg = d3.select(".map").insert("svg:svg")
      .attr("width", w)
      .attr("height", h)
        .call(zoom)
      .append("g");
  
  var state = svg.append("svg:g")
      .attr("id", "state")
      .attr("class", color);
  
  var circles = svg.append("svg:g")
      .attr("id", "circles");
  
  var cells = svg.append("svg:g")
      .attr("id", "cells");

  var colors = d3.scale.quantize()
      .range(colorbrewer[color][9]);
  
  var data;
  
  var rate;
  
  d3.select(".sedes").on("change", headquarters);
  d3.select(".links").on("change", links);
  d3.selectAll('button').on('click', zoomClick);
  
  //carrega arquivo com os valores das taxas
  d3.json("data/" + rate_file, function(file) {
  
    data = file;

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
          .enter().append("svg:g");
    
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
    svg.attr("transform", "translate(" + zoom.translate() + ")" + "scale(" + zoom.scale() + ")" );
  }
  
  function interpolateZoom (translate, scale) {
      var self = this;
      return d3.transition().duration(350).tween("zoom", function () {
          var iTranslate = d3.interpolate(zoom.translate(), translate),
              iScale = d3.interpolate(zoom.scale(), scale);
          return function (t) {
              zoom
                  .scale(iScale(t))
                  .translate(iTranslate(t));
              zoomed();
          };
      });
  }
  
  function zoomClick() {
      var clicked = d3.event.target,
          direction = 1,
          factor = 0.2,
          target_zoom = 1,
          center = [w/ 2, h/ 2],
          extent = zoom.scaleExtent(),
          translate = zoom.translate(),
          translate0 = [],
          l = [],
          view = {x: translate[0], y: translate[1], k: zoom.scale()};
  
      d3.event.preventDefault();
      direction = (this.id === 'zoom_in') ? 1 : -1;
      target_zoom = zoom.scale() * (1 + factor * direction);
  
      if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }
  
      translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
      view.k = target_zoom;
      l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];
  
      view.x += center[0] - l[0];
      view.y += center[1] - l[1];
  
      interpolateZoom([view.x, view.y], view.k);
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
