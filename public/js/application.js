$(document).ready(function(){
  var url = location.pathname.split("/")[1];
  $('.side-nav li a[href^="/' + url + '"]').addClass('active');
});
