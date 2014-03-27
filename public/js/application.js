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

$(document).ready(function(){
  $("#myTags").tagit({
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
    graph.toggleClass('back-white back-black');
  });
});
