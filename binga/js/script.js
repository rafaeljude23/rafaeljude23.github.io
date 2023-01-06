$(document).ready(function() {

    // booking iframe section
    // var bookFrameSection = $(".book-frame-section");
    // var priceWrapper = $(".menu-items-wrapper .menu-item .image-canvas .price-wrapper");
    // $(bookFrameSection).slideUp();

    // show booking section on book button click
    // $('.menu-desktop .btn-book').click(function() {
    //     var bookFSection = $(this).parent().parent().parent().find(".book-frame-section");
    //     var bookParent = $(this).parent();
    //     $(bookFSection).slideDown();
    //     $(bookFrameSection).not(bookFSection).slideUp();

    //     $(bookParent).css('margin-bottom', $(bookParent).height());
    //     $(priceWrapper).not(bookParent).css('margin-bottom', '1.5rem');
    // });

    // $('.menu-mobile .btn-book').click(function() {
    //     var bookFSection = $(this).parent().parent().parent().find(".book-frame-section");
    //     var bookParent = $(this).parent();
    //     $(bookFSection).slideDown();
    //     $(bookFrameSection).not(bookFSection).slideUp();

    //     $(bookParent).css('margin-bottom', $(bookParent).height() + 30);
    //     $(priceWrapper).not(bookParent).css('margin-bottom', '1.5rem');
    // });

    // add active class on highlight
    $('.menu-body ul li a').on('click', function() {
        var scrollAnchor = $(this).attr('href'),
            scrollPoint = $('div[id="' + scrollAnchor + '"]').offset().top - 28;

        $('body,html').animate({
            scrollTop: scrollPoint
        }, 500);

        return false;
    });

    $(window).scroll(function() {
        var windscroll = $(window).scrollTop();
        if (windscroll >= 0) {
            $('.menu-desktop .menu-items-wrapper section').each(function(i) {
                if ($(this).offset().top - 150 <= windscroll) {
                    $('.menu-body ul li a.active').removeClass('active');
                    $('.menu-body ul li a').eq(i).addClass('active');
                }
            });
        } else {
            $('.menu-body ul li a.active').removeClass('active');
            $('.menu-body ul li a').addClass('active');
        }
    }).scroll();

    // open burger menu
    var menu = $(".header-mobile");
    var menuIcon = $(".menu-icon");
    var navMenu = $(".nav-menu");
    var navLogo = $(".nav-callback");

    $(menuIcon).click(function() {
        $(navLogo).toggleClass("active");
        $(menuIcon).toggleClass("active");
        $(navMenu).toggleClass("active");

        if ($(menuIcon).hasClass('active')) { 
            $('body').bind('touchmove', function(e){e.preventDefault()});
            $('html').addClass('lock-scroll');
        } else {
            $('body').unbind('touchmove');
            $('html').removeClass('lock-scroll');
        }
    });

    // menu animations
    var menuItems = document.querySelectorAll(".menu-canvas .accordion .accordion-item .accordion-collapse");
    for (var i of menuItems) {
        // collapse
        i.addEventListener('show.bs.collapse', function () {
            $(this).find('ul.category-links li').each(function(i) {
                $( this).delay(100 * i).fadeTo( "slow" , 1, function() {
                    // animation complete.
                  });
            });
        })

        // hide
        i.addEventListener('hidden.bs.collapse', function () {
            $(this).find('ul.category-links li').each(function(i) {
                $( this).fadeTo( "fast" , 0, function() {
                    // animation complete.
                  });
            });
        })
    }

    // hamburger menu
    var div = $('.header-mobile');
    var btnMenu = $('.header-mobile .navbar');
    var menuIcon = $('.header-mobile .menu-icon');
    var distance = $(div).offset().top,
    $window = $(window);

    $window.scroll(function() {
        if ( $window.scrollTop() > distance) {
            $(div).addClass("scroll");
        } else {
            $(div).removeClass("scroll");
        }
    });

    $('.extratours-carousel.owl-carousel').owlCarousel({
        margin:10,
        loop: false,
        rewind: true,
        dots:false,
        nav:true,
        mouseDrag: false,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:4
            },
            1000:{
                items:5
            }
        }
    });

    $('.inclusive-carousel.owl-carousel').owlCarousel({
        loop:false,
        mouseDrag: false,
        margin:10,
        nav:true,
        responsive:{
            0:{
                items:1,
                mouseDrag: true,
                loop:true,
            },
            600:{
                loop:true,
                mouseDrag: true,
                items:3
            },
            1000:{
                items:4
            }
        }
    });

    $('.activities-box-items.owl-carousel').owlCarousel({
        loop: true,
        margin: 5,
        nav: false,
        dots: false,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            1000:{
                items:1
            }
        }
    });
});