$(document).ready(function () {

// Captcha
var code;
var method = 'text';
var captchaMethod = $('[name=captchaMethod]');

createCaptcha();

captchaMethod.on('change', function(){
  if ($(this).val() === 'text') {
    $('.captcha_text').show();
    $('.captcha_audio').hide();
    method = 'text';
  } else {
    $('.captcha_audio').show();
    $('.captcha_text').hide();
    method = 'audio';
  }
  createCaptcha();
})

function createCaptcha() {
  if(method === 'text') {
    document.getElementById('captcha').innerHTML = "";
    var charsArray =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    var length = 6;
    var captcha = [];
    for (var i = 0; i < length; i++) {
      var index = Math.floor(Math.random() * charsArray.length + 1);        
      captcha.push(charsArray[index]);
    }

    var canv = document.createElement("canvas");
    canv.id = "captcha";
    canv.width = 120;
    canv.height = 50;
    var ctx = canv.getContext("2d");
    ctx.font = "25px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);
    code = captcha.join(""); //storing captcha characters        
    document.getElementById("captcha").appendChild(canv);

    createCaptchaImg(canv);
  }
}

function validateCaptcha() {
  event.preventDefault();
  if (document.getElementById("captchaTextBox").value == code) {
    alert("Input is correct")
  } else {
    alert("Input is incorrect. Please try again.");
    createCaptcha();
  }
}

function createCaptchaImg(canvas) {
  var captcha = document.getElementById('captcha');
  var dataURL = canvas.toDataURL();
  var captchaImg = document.getElementById('captchaImg');
  captchaImg.setAttribute('src', dataURL);
}

$('#captchaRefresh').click(function() {
  createCaptcha();
});

  $(window).scroll(function() {
    if ($(this).scrollTop() > 1){  
      $('.navbar').addClass("navbar-sticky");
    }
    else{
      $('.navbar').removeClass("navbar-sticky");
    }
  });
  
  function disableClick(form, isDisabled) {
    $(form).find('input, textarea, button').prop("disabled", isDisabled);
      if (isDisabled) {      
        $(form).find('button').html('Sending... <img class="submitloader" src="images/loader.svg" />');  
      } else {      
        $(form).find('button').html('Submit');    
      } }  
      function resetErrors() {    
        $('.has-error').removeClass('has-error');    
        $('.text-danger').remove();  
      }  
      $("form").submit(function (event) {    

        if (document.getElementById("captchaTextBox").value == code) {
          alert("Captcha is correct")
        } else {
          alert("Captcha is incorrect. Please try again.");
          event.preventDefault();
          return false;
          createCaptcha();
        }    

        var form = this;    resetErrors();    
        disableClick(form, true);    
        var formData = {      
          fullname: $("[name=fullname]").val(),     
          email: $("[name=email]").val(),      
          phone: $("[name=phone]").val(),      
          message: $("[name=message]").val()    
        };    
        $.ajax({      
          type: "POST",      
          url: "php/sendemail.php",      
          data: formData,      
          dataType: "json",      
          encode: true    
        }).done(function (data) {     
         disableClick(form, false);      
         console.log(data);    
         if (!data.success) {     
          if (data.errors.name) {          
            $("#name-group").addClass("has-error");          
            $("#name-group").append('<div class="text-danger">' + data.errors.name + "</div>");
          }        
          if (data.errors.email) {          
            $("#email-group").addClass("has-error");          
            $("#email-group").append('<div class="text-danger">' + data.errors.email + "</div>");
          }        
          if (data.errors.phone) {          
            $("#phone-group").addClass("has-error");          
            $("#phone-group").append('<div class="text-danger">' + data.errors.phone + "</div>"); 
          } 
        } else {       
          $("form").html(`<div class="success-box"><h2>` + data.message + `</h2>              
            <p><strong>Thanks for being awesome!</strong><br>              
            We have received your message and would like to thank you for writing to us. </p>    
            <p>Talk to you soon, <br> Inspiration Marketing</p></div>`);      
        }
      });    
        event.preventDefault(); 
      });  

      $('a[href^="#"]').on('click', function (event) {    
        var target = $(this.getAttribute('href'));    
        if (target.length) {      
          event.preventDefault();      
          $('html, body').stop().animate({        
            scrollTop: target.offset().top      
          }, 1000);    }  });

      });



