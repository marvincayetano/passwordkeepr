$(document).ready(function() {
  $('#deleteOrg').on('submit', function(event){
      event.preventDefault();

      $.ajax({
          type: 'DELETE',
          url: `/organization/${document.getElementById("orgInput").value}`,
          success: function() {
            window.location.reload();
          }
      });
  });
});
