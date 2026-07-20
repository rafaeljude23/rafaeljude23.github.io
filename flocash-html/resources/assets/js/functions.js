$(document).ready(function() {

  $('#cookie-accept').click(function(){
    Cookies.set('cookiepolicy', 'accept');
    $('#cookiepolicy').remove();
  });
  if(Cookies.get('cookiepolicy') == 'accept'){
    $('#cookiepolicy').remove();
  }
  
   // WOW JS
    new WOW().init();

// new WOW({
//   mobile: false
// }).init();

$('.site-header__toggler').on('click', function (e) {
  e.stopPropagation();

  $('.mobile-menu')
    .stop(true, true)
    .fadeToggle(300);
});

$('.mobile-menu__dropdown-toggle').on('click', function (e) {
  e.preventDefault();

  $(this)
    .toggleClass('is-active')
    .next('.mobile-menu__dropdown-menu')
    .stop(true, true)
    .slideToggle(300);
});

$('.mobile-menu__close').on('click', function () {
  $('.mobile-menu')
    .stop(true, true)
    .fadeOut(300);
});

$(document).on('click', function (e) {
  const $container = $('.mobile-menu__inner');
  const $menu = $('.mobile-menu');

  if (
    $menu.is(':visible') &&
    !$container.is(e.target) &&
    $container.has(e.target).length === 0
  ) {
    $menu.stop(true, true).fadeOut(300);
  }
});
  // BACK TO TOP
  const $backToTop = $('#back-to-top');

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) {
      $backToTop.fadeIn();
    } else {
      $backToTop.fadeOut();
    }
  });

  $backToTop.on('click', function () {
    $('html, body').animate({
      scrollTop: 0
    }, 300);
  });

});