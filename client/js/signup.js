//https://codepen.io/diegoleme/pen/surIK

$(() => {

  $('#signin-form').submit((e) => {
    e.preventDefault();

    $.post('/api/signup', $( "#signin-form" ).serialize())
    .done(() => {
      alert("Successful Signup");
      window.location = "/login";
    })
    .fail(() => alert("Failed Signup. Please fill all fields."));
  })
})