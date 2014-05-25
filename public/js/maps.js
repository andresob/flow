var width = window.innerWidth -100,
    height = window.innerHeight;

var projection = d3.geo.mercator()
    .scale(5500)
    .translate([1250, 100]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#cartogram").insert("svg:svg")
    .attr("width", width - 50)
    .attr("height", height);

var percent = (function() {
      var fmt = d3.format(".2f");
      return function(n) { return fmt(n) + "%"; };
    })(),
    fields = [
      {name: "escolha a opção", id: "none"},
      {name: "Imigrantes", id: "popest", key: "POPESTIMATE%d"},
      {name: "Emigrantes", id: "births", key: "BIRTHS%d"},
      {name: "Saldo Migratório", id: "deaths", key: "DEATHS%d"},
    ],
    years = [2010, 2011],
    fieldsById = d3.nest()
      .key(function(d) { return d.id; })
      .rollup(function(d) { return d[0]; })
      .map(fields),
    field = fields[0],
    year = years[0],
    colors = colorbrewer.RdYlBu[5]
      .reverse()
      .map(function(rgb) { return d3.hsl(rgb); });

var body = d3.select("#cartogram"),
    stat = d3.select("#status");

var fieldSelect = d3.select("#field")
  .on("change", function(e) {
    field = fields[this.selectedIndex];
    location.hash = "#" + [field.id, year].join("/");
  });

fieldSelect.selectAll("option")
  .data(fields)
  .enter()
  .append("option")
    .attr("value", function(d) { return d.id; })
    .text(function(d) { return d.name; });

var yearSelect = d3.select("#year")
  .on("change", function(e) {
    year = years[this.selectedIndex];
    location.hash = "#" + [field.id, year].join("/");
  });

yearSelect.selectAll("option")
  .data(years)
  .enter()
  .append("option")
    .attr("value", function(y) { return y; })
    .text(function(y) { return y; })

  var states = svg.append("g")
      .attr("id", "states")
      .selectAll("path");

var topology,
    geometries,
    rawData,
    dataById = {},
    carto = d3.cartogram()
      .projection(projection)
      .properties(function(d) {
        return dataById[d.id];
      })
      .value(function(d) {
        return +d.properties[field];
      });

window.onhashchange = function() {
  parseHash();
};

d3.json( "/data/maps/brazil.topo.json", function(topo) {
  topology = topo;
  geometries = topology.objects.states.geometries;
  d3.csv("/data/cartogram/brasil.csv", function(data) {
    dataById = d3.nest()
      .key(function(d) { return d.NAME; })
      .rollup(function(d) { return d[0]; })
      .map(data);
    init();
  });
});

function init() {
  var features = carto.features(topology, geometries);

  states = states.data(features)
    .enter()
    .append("path")
      .attr("class", "state")
      .attr("fill", "#fafafa")
      .attr("id", function(d) {
        return d.properties.NAME;
      })
      .attr("d", path);

  states.append("title");

  parseHash();
}

function reset() {
  stat.text("");
  body.classed("updating", false);

  var features = carto.features(topology, geometries);

  states.data(features)
    .transition()
      .duration(750)
      .ease("linear")
      .attr("fill", "#fafafa")
      .attr("d", path);

  states.select("title")
    .text(function(d) {
      return d.properties.NAME;
    });
}

function update() {
  var start = Date.now();
  body.classed("updating", true);

  var key = field.key.replace("%d", year),
      fmt = (typeof field.format === "function")
        ? field.format
        : d3.format(field.format || ","),
      value = function(d) {
        return +d.properties[key];
      },
      values = states.data()
        .map(value)
        .filter(function(n) {
          return !isNaN(n);
        })
        .sort(d3.ascending),
      lo = values[0],
      hi = values[values.length - 1];

  var color = d3.scale.linear()
    .range(colors)
    .domain(lo < 0
      ? [lo, 0, hi]
      : [lo, d3.mean(values), hi]);

  var scale = d3.scale.linear()
    .domain([lo, hi])
    .range([1, 1000]);

  carto.value(function(d) {
    return scale(value(d));
  });

  var features = carto(topology, geometries).features;

  states.data(features)
    .select("title")
      .text(function(d) {
        return [d.properties.NAME, fmt(value(d))].join(": ");
      });

  states.transition()
    .duration(750)
    .ease("linear")
    .attr("fill", function(d) {
      return color(value(d));
    })
    .attr("d", carto.path);

  var delta = (Date.now() - start) / 1000;
  body.classed("updating", false);
}

var deferredUpdate = (function() {
  var timeout;
  return function() {
    var args = arguments;
    clearTimeout(timeout);
    return timeout = setTimeout(function() {
      update.apply(null, arguments);
    }, 10);
  };
})();


function parseHash() {
  var parts = location.hash.substr(1).split("/"),
      desiredFieldId = parts[0],
      desiredYear = +parts[1];

  field = fieldsById[desiredFieldId] || fields[0];
  year = (years.indexOf(desiredYear) > -1) ? desiredYear : years[0];

  fieldSelect.property("selectedIndex", fields.indexOf(field));

  if (field.id === "none") {

    yearSelect.attr("disabled", "disabled");
    reset();

  } else {

    if (field.years) {
      if (field.years.indexOf(year) === -1) {
        year = field.years[0];
      }
      yearSelect.selectAll("option")
        .attr("disabled", function(y) {
          return (field.years.indexOf(y) === -1) ? "disabled" : null;
        });
    } else {
      yearSelect.selectAll("option")
        .attr("disabled", null);
    }

    yearSelect
      .property("selectedIndex", years.indexOf(year))
      .attr("disabled", null);

    deferredUpdate();
    location.replace("#" + [field.id, year].join("/"));

  }
}

