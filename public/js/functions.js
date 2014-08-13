(function($) { "use strict";   
  $(document).ready(function (){

  /*-----------------------------------------------------------------------------------*/
  /*  FOOTER COPYRIGHT YEAR
  /*-----------------------------------------------------------------------------------*/
    var currentYear = (new Date).getFullYear();
    $('span.date').text(currentYear);

  /*-----------------------------------------------------------------------------------*/
  /*  CONTACT FORM
  /*-----------------------------------------------------------------------------------*/
    $("#ajax-contact-form").submit(function() {
      var str = $(this).serialize();

      $.ajax({
        type: "POST",
        url: "includes/contact-process.php",
        data: str,
        success: function(msg) {
            // Message Sent? Show the 'Thank You' message
            if(msg == 'OK') {
              result = '<div class="notification_ok alert-box success radius">Your message has been sent. Thank you!</div>';
              //$("#fields").hide();
            } else {
              result = msg;
            }
            $('#note').html(result);
        }
      });
      return false;
    });



  });
})(jQuery);