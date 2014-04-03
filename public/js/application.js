function search_node(attr, value) {
  return flow.nodes.filter(function(n) {
    return n.name.toLowerCase().indexOf(value.toLowerCase()) >= 0;
  });
};

function get_node_name(attr, value) {
  return search_node(attr, value).map(function(n) {
    return n.name;
  });
};

SVGElement.prototype.hasClass = function (className) {
  return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this.getAttribute('class'));
};

SVGElement.prototype.addClass = function (className) {
  if (!this.hasClass(className)) {
    this.setAttribute('class', this.getAttribute('class') + ' ' + className);
  }
};

SVGElement.prototype.removeClass = function (className) {
  var removedClass = this.getAttribute('class').replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
  if (this.hasClass(className)) {
    this.setAttribute('class', removedClass);
  }
};

SVGElement.prototype.toggleClass = function (className) {
  if (this.hasClass(className)) {
    this.removeClass(className);
  } else {
    this.addClass(className);
  }
};

function dicState (a) {

  switch(a) {
    case "Acre":
      return [24000, [5100,-300], "ac"];
    case "Alagoas":
      return [50000, [5450,-1050], "al"];
    case "Amazonas":
      return [14000, [2900,200], "am"];
    case "Amapá":
      return [25000, [3950,450], "ap" ];
    case "Bahia":
      return [19000, [2600,-400], "ba"];
    case "Ceará":
      return [30000, [3600,-100], "ce"];
    case "Espírito Santo":
      return [41000, [4900, -1950], "es"];
    case "Goiás":
      return [24000, [3650, -700], "go"];
    case "Maranhão":
      return [20000, [2800, 50], "ma"];
    case "Minas Gerais":
      return [20000, [2950, -700], "mg"];
    case "Mato Grosso do Sul":
      return [22000, [3680, -900], "ms"];
    case "Mato Grosso":
      return [16000, [2850, -200], "mt"];
    case "Pará":
      return [14000, [2400, 200], "pa"];
    case "Paraíba":
      return [39000, [4300, -400], "pb"];
    case "Pernambuco":
      return [36000, [4200, -500], "pe"];
    case "Piauí":
      return [22000, [2900, -90], "pi"];
    case "Paraná":
      return [26000, [4050, -1500], "pr"];
    case "Rio de Janeiro":
      return [42000, [5350, -2350], "rj"];
    case "Rio Grande do Norte":
      return [46000, [5050, -400], "rn"];
    case "Rondônia":
      return [22000, [4150, -350], "ro"];
    case "Roráima":
      return [21000, [3900, 450], "rr"];
    case "Rio Grande do Sul":
      return [24000, [3950, -1760], "rs"];
    case "Santa Catarina":
      return [29000, [4450, -2000], "sc"];
    case "Sergipe":
      return [50000, [5450, -1150], "se"];
    case "São Paulo":
      return [24000, [3650, -1200], "sp"];
    case "Tocantis":
      return [20000, [3000, -150], "to"];
   default:
      return alert ("Faça a busca novamente");
  }
};

$(document).ready(function(){
  //search node on graph view
  $("#searchNode").tagit({
    tagSource: function(request, response){
      response(get_node_name("name", request.term));
    },
    tagLimit: 1,
    allowSpaces: true,
    onlyAvailableTags: true,
    removeConfirmation: true,
    autocomplete: {minLength: 3},
    afterTagAdded: function(event, ui){
      search(ui.tagLabel)
    },
    afterTagRemoved: function(event, ui){
      search(ui.tagLabel)
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
      drawState(ui.tagLabel)
    },
  });

  //set class active on menu
  $('.side-nav li a[href$="' + location.pathname.split("/")[1] + '"]').addClass('active');

  //click to hide menu and search bar
  $('.downbar .hide-stuffs').click(function (e){
    e.preventDefault();
    $('.sidebar').toggleClass('fadeInDown bounceOutUp');
    $('.side-search').toggleClass('fadeInRight bounceOutRight');
  });

  //click to invert colors
  $('.downbar .invert').click(function (e){
    e.preventDefault();
    var graph = document.querySelector('#graph svg');
    graph.toggleClass('back-white');
    graph.toggleClass('back-black');
  });
});
