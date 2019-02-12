/* Closes navigation when you click on a link */
$('.nav-link').on('click',function() {
  $('.navbar-collapse').collapse('hide');
});

/* Closes Navigation on mobile when you click outside */
$(document).click(function (event) {
    var clickover = $(event.target);
    var $navbar = $(".navbar-collapse");
    var _opened = $navbar.hasClass("show");
    if (_opened === true && !clickover.hasClass("navbar-toggler")) {
        $navbar.collapse('hide');
    }
});
