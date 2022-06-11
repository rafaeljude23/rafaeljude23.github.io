$(document).ready(function () {

  $(window).scroll(function() {
    if ($(this).scrollTop() > 1){  
      $('.navbar').addClass("navbar-sticky");
    }
    else{
      $('.navbar').removeClass("navbar-sticky");
    }
  });


  $('a[href^="#"]').on('click', function (event) {    
    var target = $(this.getAttribute('href'));    
    if (target.length) {      
      event.preventDefault();      
      $('html, body').stop().animate({        
        scrollTop: target.offset().top      
      }, 1000);    }  
  });

});



