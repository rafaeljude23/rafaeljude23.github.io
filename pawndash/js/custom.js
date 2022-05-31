$(document).ready(function() {
	$('.owl-carousel').owlCarousel({
		dots: false,
	  margin: 40,
	  loop: true,
	  autoWidth:true,
	  autoplay: true,
	  nav:true,
		navText: [ '<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>' ],
		items: 4,
    responsive:{
    	0: {
    		margin: 10
    	},
      500:{
      	margin: 30

      },
      1000:{
        center:true
      },
      1200:{
        center:false
      }
    }
	});
       
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip();
	});
});