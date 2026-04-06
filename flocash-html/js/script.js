$(document).ready(function() {

  $('.solutions__slider').slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1,
    appendArrows: $('.solutions__controls'),
    prevArrow: '<button class="solutions__arrow solutions__arrow--prev"><img class="" src="img/slider-arrow-right.svg" alt=""></button>',
    nextArrow: '<button class="solutions__arrow solutions__arrow--next"><img class="" src="img/slider-arrow-right.svg" alt=""></button>',
    responsive: [
      // {
      //   breakpoint: 1024,
      //   settings: {
      //     slidesToShow: 3,
      //     slidesToScroll: 3,
      //     infinite: true,
      //     dots: true
      //   }
      // },
      // {
      //   breakpoint: 600,
      //   settings: {
      //     slidesToShow: 2,
      //     slidesToScroll: 2
      //   }
      // },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });

  $('.accordion__header').click(function() {
    
    // 1. Remove active class from all headers except the one clicked
    $('.accordion__header').not(this).removeClass('accordion__header--active');
    
    // 2. Toggle the active class on the clicked header
    $(this).toggleClass('accordion__header--active');
    
    // 3. Slide up all other content panels
    $('.accordion__body').not($(this).next()).slideUp();
    
    // 4. Slide toggle the current content panel
    $(this).next('.accordion__body').slideToggle();
  });

  $('.site-header__menu-toggler').click(function(){
    $('.site-header__modal').fadeToggle();
  });

  $('.site-header__dropdown-toggle').click(function(){
    $(this).toggleClass('active').next('.site-header__dropdown-menu').slideToggle();
  });

  $('.site-header__menu-close').click(function(){
    $('.site-header__modal').fadeOut();
  });

});