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
      //hideNodes(ui.tagLabel)
    },
    afterTagRemoved: function(event, ui){
      //showNodes(ui.tagLabel)
    }
  });

  //set class active on menu
  $('.side-nav li a[href$="' + location.pathname.split("/")[1] + '"]').addClass('active');

});
