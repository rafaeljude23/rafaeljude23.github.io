$(document).ready(function() {

   // WOW JS
    new WOW().init();

// new WOW({
//   mobile: false
// }).init();

  $('.site-header__toggler').click(function(){
    $('.mobile-menu').fadeToggle(300);
  });

  $('.mobile-menu__dropdown-toggle').click(function(){
    $(this).toggleClass('is-active').next('.mobile-menu__dropdown-menu').slideToggle();
  });

  $('.mobile-menu__close').click(function(){
     $('.mobile-menu').fadeOut(300);
  });

  $(document).mouseup(function(e) 
  {
      var container = $(".mobile-menu__inner");

      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) 
      {
        $('.mobile-menu').fadeOut(300);
      }
  });


});