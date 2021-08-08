//https://codepen.io/diegoleme/pen/surIK

$(function (){
  var $password = $('#password-field');
  var $username = $('#username-field');

  $('#login-form-submit').on('click', function(e) {
    e.preventDefault();

    var user = {
      password: $password.val(),
      username: $username.val(),
    };

    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: user,
      success: function() {
        window.location = "/share";
      },
      error: function() {
        alert("Username or Password incorrect");
      }
    })
  })
})