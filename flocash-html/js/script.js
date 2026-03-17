$('.smart-slider').slick({
  dots: false,
  infinite: false,
  speed: 300,
  slidesToShow: 2,
  slidesToScroll: 1,
  appendArrows: $('.smart-arrow'),
  prevArrow: '<button><img class="slider-left-arrow" src="img/slider-arrow-right.svg" alt=""></button>',
  nextArrow: '<button><img class="slider-right-arrow" src="img/slider-arrow-right.svg" alt=""></button>'

  // responsive: [
  //   {
  //     breakpoint: 1024,
  //     settings: {
  //       slidesToShow: 3,
  //       slidesToScroll: 3,
  //       infinite: true,
  //       dots: true
  //     }
  //   },
  //   {
  //     breakpoint: 600,
  //     settings: {
  //       slidesToShow: 2,
  //       slidesToScroll: 2
  //     }
  //   },
  //   {
  //     breakpoint: 480,
  //     settings: {
  //       slidesToShow: 1,
  //       slidesToScroll: 1
  //     }
  //   }
  //   // You can unslick at a given breakpoint now by adding:
  //   // settings: "unslick"
  //   // instead of a settings object
  // ]
});


$(document).ready(function() {
  $('.accordion-header').click(function() {
    
    // 1. Remove active class from all headers except the one clicked
    $('.accordion-header').not(this).removeClass('active');
    
    // 2. Toggle the active class on the clicked header
    $(this).toggleClass('active');
    
    // 3. Slide up all other content panels
    $('.accordion-content').not($(this).next()).slideUp();
    
    // 4. Slide toggle the current content panel
    $(this).next('.accordion-content').slideToggle();
  });
});