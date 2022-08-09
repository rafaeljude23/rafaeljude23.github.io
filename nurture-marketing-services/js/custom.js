$(document).ready(function(){
  new WOW().init();
  
  $(window).scroll(function() {
    if ($(this).scrollTop() > 1){  
      $('.navbar').addClass("navbar-sticky");
    }
    else{
      $('.navbar').removeClass("navbar-sticky");
    }
  });
});

// Hambuger Menu
// For toggling and finding number of children and other stuff is done here!

const navigation = document.getElementById("nav");
const menu = document.getElementById("menu");

menu.addEventListener("click", () => {
  // The navigation.children.length means the following :-
  // The children inside a parent are basically an array of elements; So, here I'm finding the length of the array aka how many children are inside the nav bar.
  //   Yup That's all.
  navigation.style.setProperty("--childenNumber", navigation.children.length);

  //    Casually Toggling Classes to make them animate on click
  //   Regular stuff ;)
  navigation.classList.toggle("active");
  menu.classList.toggle("active");
});


// Footer Behind
function footer_behind_ctn(){
  var footerHeight = $('.footer-copyright').outerHeight();
  $('.page-wrap').css('margin-bottom', footerHeight);
}

$(document).ready(footer_behind_ctn);
$(window).resize(footer_behind_ctn);
