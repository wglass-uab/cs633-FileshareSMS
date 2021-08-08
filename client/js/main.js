$(function (){

  $('#fileshare-form').submit(function(e) {
    e.preventDefault();

    $.post('/api/upload', $( "#fileshare-form" ).serialize())
    .done(() => alert("File shared successfully"))
    .fail(() => alert("There were problems sharing your file."));
  })
})
