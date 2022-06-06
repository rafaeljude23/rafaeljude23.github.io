$(document).ready(function(){
    AOS.init({
        duration: 1000, // values from 0 to 3000, with step 50ms
        easing: 'ease', // default easing for AOS animations
        once: true, // whether animation should happen only once - while scrolling down
      });

    /* Dropdown Fade Effect */
	var fadeIn = "animate__fadeIn";
	var fadeOut = "animate__fadeOut";
	$('li.drop-link').on('mouseenter', function(){
        var target = $(this).attr("data-target");
        $("." + target).fadeIn(300, function() {});
    });
    $('li.drop-link').on('mouseleave', function(){
        var target = $(this).attr("data-target");
        $("." + target).fadeOut(300, function() {});
    });
    
});