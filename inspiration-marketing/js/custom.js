$(document).ready(function () {
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
        }});    
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


