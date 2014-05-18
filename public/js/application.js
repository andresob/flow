function dicState (a) {

  switch(a) {
    case "Acre":
      return ["ac", "Acre"];
    case "Alagoas":
      return ["al", "Alagoas"];
    case "Amazonas":
      return ["am", "Amazonas"];
    case "Amapá":
      return ["ap", "Amapá" ];
    case "Bahia":
      return ["ba", "Bahia"];
    case "Ceará":
      return ["ce", "Ceará"];
    case "Espírito Santo":
      return ["es", "Espírito Santo"];
    case "Goiás":
      return ["go", "Goiás"];
    case "Maranhão":
      return ["ma", "Maranhão"];
    case "Minas Gerais":
      return ["mg", "Minas Gerais"];
    case "Mato Grosso do Sul":
      return ["ms", "Mato Grosso do Sul"];
    case "Mato Grosso":
      return ["mt", "Mato Grosso"];
    case "Pará":
      return ["pa", "Pará"];
    case "Paraíba":
      return ["pb", "Paraíba"];
    case "Pernambuco":
      return ["pe", "Pernambuco"];
    case "Piauí":
      return ["pi", "Piauí"];
    case "Paraná":
      return ["pr", "Paraná"];
    case "Rio de Janeiro":
      return ["rj", "Rio de Janeiro"];
    case "Rio Grande do Norte":
      return ["rn", "Rio Grande do Norte"];
    case "Rondônia":
      return ["ro", "Rondônia"];
    case "Roráima":
      return ["rr", "Roráima"];
    case "Rio Grande do Sul":
      return ["rs", "Rio Grande do Sul"];
    case "Santa Catarina":
      return ["sc", "Santa Catarina"];
    case "Sergipe":
      return ["se", "Sergipe"];
    case "São Paulo":
      return ["sp", "São Paulo"];
    case "Tocantis":
      return ["to", "Tocantis"];
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
		max: 120610,
    step: 100,
		values: [ 5000, 120610 ],
		slide: function( event, ui ) {
			$( ".sliderRangeLabel" ).html(ui.values[ 0 ] + " até " + ui.values[ 1 ] );
      $(".ui-slider-range.ui-widget-header.ui-corner-all").css("left", ui.values[0]/120610*100 + "%");
      $(".ui-slider-range.ui-widget-header.ui-corner-all").css("width", (ui.values[1]-ui.values[0])/120610*100 + "%");
		},
    change: function(event, ui) {
      rangeLinks(ui.values[0], ui.values[1], flow);
    }
	});

  //color button pickDate
  $(".pick").click(function(d) {
    $(".pick").removeClass("active");
    $(this).addClass("active");
  });

});
