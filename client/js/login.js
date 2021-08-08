//https://codepen.io/diegoleme/pen/surIK

$(() => {
  const $password = $('#password-field'),
      $username = $('#username-field');

  $('#login-form-submit').on('click', (e) => {
    e.preventDefault();

    const user = {
      password: $password.val(),
      username: $username.val(),
    };

    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: user,
      success: () => window.location = "/share",
      error: () => alert("Username or Password incorrect")
    })
  })
})