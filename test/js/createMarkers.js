
var myMap;
var markers = [];

function setMyMap(map){
  myMap = map;
}

function showMarker(){
    var lat = parseInt($( "input[name=latitude]" ).val());
    var lng = parseInt($( "input[name=longtitude]" ).val());
    console.log(lat + " " + lng);
    
    var marker = new google.maps.Marker({
	    position: {lat: lat, lng: lng},
	    map: myMap
    });
    
    if ( !isNaN(lat) && !isNaN(lng)){
        markers.push(marker); 
        clearPreviusMarkers();
        showCurrentMarkers(marker, lat, lng);
    }
};

function clearPreviusMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
};

function showCurrentMarkers(marker, lat, lng) {
  marker.setMap(myMap);
  myMap.panTo({lat: lat, lng: lng});
};

