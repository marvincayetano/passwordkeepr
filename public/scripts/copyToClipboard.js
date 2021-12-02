function myFunction() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).val()).select();
  document.execCommand("copy");
  $temp.remove();
  myFunction();
}

$(document).ready(function () {
  const copyBtnUsername = $("[id=copyBtnUsername]");
  const copyBtnPassword = $("[id=copyBtnPassword]");

  for(const btn of copyBtnUsername) {
    $(btn).on('click', () => {
      copyToClipboard($(`#${btn.value}`));
    });
  }

  for(const btn of copyBtnPassword) {
    $(btn).on('click', () => {
      copyToClipboard($(`#${btn.value}`));
    });
  }
});
