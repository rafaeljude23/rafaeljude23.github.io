$(document).ready(function(){
  new WOW().init();
  
  // Sticky Header
  $(window).scroll(function() {
    if ($(this).scrollTop() > 1){  
      $('.main-header').addClass("sticky-header");
    }
    else{
      $('.main-header').removeClass("sticky-header");
    }
  });

  // Menu Toggle
  $('.menu-toggle').click(function(){
    $(this).toggleClass('active');
    $('.main-nav').toggleClass('main-nav-open');
  });


  // Footer Behind
  function footer_behind_ctn(){
    var footerHeight = $('.main-footer').outerHeight() + 10;
    $('.page-wrap').css('margin-bottom', footerHeight);
  }

  $(document).ready(footer_behind_ctn);
  $(window).resize(footer_behind_ctn);

});


