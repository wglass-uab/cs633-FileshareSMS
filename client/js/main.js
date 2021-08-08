$(() => {
  $('#fileshare-form').submit((e) => {
    e.preventDefault();
    
    var fd = new FormData();
    var files = $('#sharefile')[0].files;
        
    // Check file selected or not
    if(files.length > 0 ){
       fd.append('file',files[0]);

       $.ajax({
          url: '/api/upload',
          type: 'post',
          data: fd,
          contentType: false,
          processData: false,
          success: function(response){
                 if(response == 'OK'){
                    alert('file uploaded');
                 }else{
                    alert('file not uploaded');
                 }
              },
           });
    }else{
       alert("Please select a file.");
    }
  })
})
