//https://codepen.io/diegoleme/pen/surIK

$(function (){

  $('#signin-form').submit(function(e) {
    e.preventDefault();

    $.post('/api/signup', $( "#signin-form" ).serialize())
    .done(() => alert("Successful Signup"))
    .fail(() => alert("Failed Signup. Please fill all fields."));
  })
})