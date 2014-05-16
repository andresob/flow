function dicState (a) {

  switch(a) {
    case "Acre":
      return [24000, [5100,-300], "ac", "Acre"];
    case "Alagoas":
      return [50000, [5450,-1050], "al", "Alagoas"];
    case "Amazonas":
      return [14000, [2900,200], "am", "Amazonas"];
    case "Amapá":
      return [25000, [3950,450], "ap", "Amapá" ];
    case "Bahia":
      return [19000, [2600,-400], "ba", "Bahia"];
    case "Ceará":
      return [30000, [3600,-100], "ce", "Ceará"];
    case "Espírito Santo":
      return [41000, [4900, -1950], "es", "Espírito Santo"];
    case "Goiás":
      return [24000, [3650, -700], "go", "Goiás"];
    case "Maranhão":
      return [20000, [2800, 50], "ma", "Maranhão"];
    case "Minas Gerais":
      return [20000, [2950, -700], "mg", "Minas Gerais"];
    case "Mato Grosso do Sul":
      return [22000, [3680, -900], "ms", "Mato Grosso do Sul"];
    case "Mato Grosso":
      return [16000, [2850, -200], "mt", "Mato Grosso"];
    case "Pará":
      return [14000, [2400, 200], "pa", "Pará"];
    case "Paraíba":
      return [39000, [4300, -400], "pb", "Paraíba"];
    case "Pernambuco":
      return [36000, [4200, -500], "pe", "Pernambuco"];
    case "Piauí":
      return [22000, [2900, -90], "pi", "Piauí"];
    case "Paraná":
      return [26000, [4050, -1500], "pr", "Paraná"];
    case "Rio de Janeiro":
      return [42000, [5350, -2350], "rj", "Rio de Janeiro"];
    case "Rio Grande do Norte":
      return [46000, [5050, -400], "rn", "Rio Grande do Norte"];
    case "Rondônia":
      return [22000, [4150, -350], "ro", "Rondônia"];
    case "Roráima":
      return [21000, [3900, 450], "rr", "Roráima"];
    case "Rio Grande do Sul":
      return [24000, [3950, -1760], "rs", "Rio Grande do Sul"];
    case "Santa Catarina":
      return [29000, [4450, -2000], "sc", "Santa Catarina"];
    case "Sergipe":
      return [50000, [5450, -1150], "se", "Sergipe"];
    case "São Paulo":
      return [24000, [3650, -1200], "sp", "São Paulo"];
    case "Tocantis":
      return [20000, [3000, -150], "to", "Tocantis"];
   default:
      return alert ("Faça a busca novamente");
  }
}

function search_node(value) {
  return flow.nodes.filter(function(n) {
    return n.name.toLowerCase().indexOf(value.toLowerCase()) >= 0;
  });
}

function get_node_name(value) {
  return search_node(value).map(function(n) {
    return n.name;
  });
}

$(document).ready(function(){
  //search node on graph view
  $("#searchNode").tagit({
    tagSource: function(request, response){
      response(get_node_name(request.term));
    },
    tagLimit: 1,
    allowSpaces: false,
    caseSensitive: false,
    onlyAvailableTags: true,
    removeConfirmation: true,
    autocomplete: {minLength: 3},
    afterTagAdded: function(event, ui){
      search_node(ui.tagLabel);
    },
    afterTagRemoved: function(event, ui){
      search_node(ui.tagLabel);
    }
  });

  //search state on map view
  $("#searchState").tagit({
    availableTags: ["Acre", "Alagoas", "Amazonas", "Amapá", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Minas Gerais", "Mato Grosso do Sul", "Mato Grosso", "Pará", "Paraíba", "Pernambuco", "Piauí", "Paraná", "Rio de Janeiro", "Rio Grande do Norte", "Rondônia", "Roráima", "Rio Grande do Sul", "Santa Catarina", "Sergipe", "São Paulo", "Tocantis"],
    tagLimit: 1,
    caseSensitive: true,
    allowSpaces: true,
    onlyAvailableTags: true,
    removeConfirmation: true,
    autocomplete: {minLength: 1},
    afterTagAdded: function(event, ui){
      //alert(ui.tagLabel)
      drawState(ui.tagLabel);
    },
  });

  //set class active on menu
  $('.side-nav li a[href$="' + location.pathname.split("/")[1] + '"]').addClass('active');

  //click to hide menu and search bar
  $('.downbar .hide-config').click(function (e){
    e.preventDefault();
    $('#config').toggleClass('fadeInRight bounceOutRight');
  });

  //click to invert colors
  $('.downbar .invert').click(function (e){
    e.preventDefault();
    $('body').toggleClass('black');
  });

  //insert size on div
  size = window.innerHeight;
  $("#graph, #heatmap, #map, #cartogram").css("height",size);

	//custom slider
	$(".slider").slider();

  $(".sliderMin").slider({
    range: "min",
    value: 9,
    min: 3,
    max: 15,
    slide: function( event, ui ) {
      $( ".sliderMinLabel" ).html( ui.value );
      $(".ui-slider-range.ui-widget-header.ui-corner-all.ui-slider-range-min").css("width", (ui.value-3)/12*100 + "%");
    },
    change: function(event, ui) {
      drawHex(ui.value);
    }
  });

	$( ".sliderRange" ).slider({
		range: true,
		min: 1,
		max: 20000,
		values: [ 5000, 10000 ],
		slide: function( event, ui ) {
			$( ".sliderRangeLabel" ).html(ui.values[ 0 ] + " até " + ui.values[ 1 ] );
      $(".ui-slider-range.ui-widget-header.ui-corner-all").css("left", ui.values[0]/20000*100 + "%");
      $(".ui-slider-range.ui-widget-header.ui-corner-all").css("width", (ui.values[1]-ui.values[0])/20000*100 + "%");
		},
    change: function(event, ui) {
      rangeLinks(ui.values[0], ui.values[1], flow);
    }
	});

});
