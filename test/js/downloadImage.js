/*
    This code adds listeners. Creates and loads the picture of a map
*/

var showMarkerT;

$(document).ready(function(){
    $( "input[name=download]" ).change(previewFile);
    
    // set marker if inpit data changed or pressed Enter
    $( 'input[name=longtitude]' ).bind( "change", showMarker);
    $( 'input[name=latitude]' ).bind( "change", showMarker);
    
    $(document.body).off('keyup', $( 'input[name=latitude]' ));

        $(document.body).on('keyup', $( 'input[name=latitude]' ), function(event) {
          if(event.keyCode == 13) {
            showMarker();
          }
        });
});

var image = new Image();

function previewFile() {
  var file = document.querySelector( 'input[type=file]' ).files[0];
    
  // checking `file.name`
  if ( /\.(jpe?g|png|gif)$/i.test(file.name) ){
      var reader  = new FileReader();
    
      reader.addEventListener("load", function () {
        
        image.src = reader.result;
	
        // open  input field for latitude and longitude
        $( 'input[name=latitude]' ).removeAttr("disabled");
        $( 'input[name=longtitude]' ).removeAttr("disabled");
          
        initMap(image);  
          
      }, false);

      if (file) {
          
        reader.readAsDataURL(file);
          
      }
  }    
};

