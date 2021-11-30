
$( document ).ready(function() {

  $('#modal').on('submit', function(event){
      event.preventDefault();
      $.ajax({
          url: '/',
          type: 'POST',
          data: $('#modal').serialize(),
          success: function(data){
               alert('successfully submitted')
          }
      });
  });
});
