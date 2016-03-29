/*
    This code creates map using google maps API and overrides projection.  
*/


PETERS_MAPTYPE_ID = 'peters';
LAMBERT_MAPTYPE_ID = 'lambert';
var ZOOM_LAVEL = 0;

var lambertRangeX = 800; // length x axis for Lambert`s a map ( if a picture isn`t loaded, default 800 )
var lambertRangeY =  800; // length y axis for Lambert`s a map ( if a picture isn`t loaded, default 800 )
var petersRangeX = 800; // length x axis for Peter`s a map ( if a picture isn`t loaded, default 800 )
var petersRangeY = 800; // length y axis for Peter`s a map ( if a picture isn`t loaded, default 800 )

var initMap = function(mapImage) {
    
    
    // when map was loaded setting new length, in order to map don`t stretch,
    //but some brousers (Firefox, IE) needs to know the size of the map
    console.log(checkBrowser());
    
    if (checkBrowser() == "Chrome"){
        if (mapImage != undefined){
            lambertRangeX = mapImage.width;
            lambertRangeY = mapImage.height;

            petersRangeX = mapImage.width;
            petersRangeY = mapImage.height;
        }
    }
    
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: ZOOM_LAVEL,
        center: {lat: 0, lng: 0},
        zoomControl: false,
        streetViewControl: false,
        mapTypeControlOptions: {
         style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,     
         mapTypeIds: ['peters','lambert']

        }
    });

    // Create Lambert`s cylindrical equal-area map
    
    lambertMapType = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {

           getNormalizedCoord(coord, zoom);

          return mapImage != undefined ? mapImage.src : null;
        },

        tileSize: new google.maps.Size(lambertRangeX, lambertRangeY),
        isPng: true,
        minZoom: ZOOM_LAVEL,
        maxZoom: ZOOM_LAVEL,
        name: 'Lambert'
    });
    
    
     // look this equations at https://en.wikipedia.org/wiki/Lambert_cylindrical_equal-area_projection   
    lambertMapType.projection = {

        fromLatLngToPoint: function(latLng) {
          
          // convert from degrees to radians
          var latRadians = latLng.lat() * Math.PI / 180;

          var coordX = lambertRangeX * (0.5 + (latLng.lng() + 160) / 360);
          var coordY = lambertRangeY * (0.5 - 0.5 * Math.sin(latRadians));
            
          return new google.maps.Point(coordX, coordY);
        },

	    fromPointToLatLng: function(point, noWrap) {

		  var x = point.x / lambertRangeX;
		  var y = Math.max(0, Math.min(1, point.y / lambertRangeY));

		  var lat = Math.asin((1 - 2*y) ) * 180 / Math.PI;
		  var lng = -180 + 360 * x - 160;
		  return new google.maps.LatLng(lat, lng, noWrap);
	    }
   };
    
    // Create Gall–Peter`s map
    
    petersMapType = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {

          getNormalizedCoord(coord, zoom);

          return mapImage != undefined ? mapImage.src : null;
        },

        tileSize: new google.maps.Size(petersRangeX, petersRangeY),
        isPng: true,
        minZoom: ZOOM_LAVEL,
        maxZoom: ZOOM_LAVEL,
        name: 'Gall-Peters'
    });
    
    // look this equations at https://developers.google.com/maps/documentation/javascript/maptypes#ProjectionTileUsage
    petersMapType.projection = {
        fromLatLngToPoint: function(latLng) {

          // convert from degrees to radians
          var latRadians = latLng.lat() * Math.PI / 180;

          var coordX =petersRangeX * (0.5 + latLng.lng() / 360);
          var coordY = petersRangeY * (0.5 - 0.5 * Math.sin(latRadians));
          return new google.maps.Point(coordX, coordY);
        },

        fromPointToLatLng: function(point, noWrap) {
          var x = point.x / petersRangeX;
          var y = Math.max(0, Math.min(1, point.y / petersRangeY));

          var lat = Math.asin(1 - 2 * y) * 180 / Math.PI;
          var lng = -180 + 360 * x;
          return new google.maps.LatLng(lat, lng, noWrap);
        }
    };


    map.mapTypes.set('lambert', lambertMapType);
    map.setMapTypeId('lambert');

    map.mapTypes.set('peters', petersMapType);
    map.setMapTypeId('peters');

    setMyMap(map);
    setMyMap(map);
	
};

// repeat map
function getNormalizedCoord(coord, zoom) {
  var y = coord.y;
  var x = coord.x;

  // if you will need to create zoom
  var scale = 1 << zoom;

  // don't repeat y-axis
  if (y < 0 || y >= scale) {
    return null;
  }

  // repeat x-axis
  if (x < 0 || x >= scale) {
    x = (x % scale + scale) % scale;
  }

  return {x: x, y: y};
};

    // this checking was took from http://stackoverflow.com/questions/2324944/in-javascript-how-do-i-determine-if-my-current-browser-is-firefox-on-a-computer
function checkBrowser(){
    var c = navigator.userAgent.search("Chrome");
    var f = navigator.userAgent.search("Firefox");
    var m8 = navigator.userAgent.search("MSIE 8.0");
    var m9 = navigator.userAgent.search("MSIE 9.0");
    
    if (c>-1){
        brwsr = "Chrome";
    }
    else if(f>-1){
        brwsr = "Firefox";
    }else if (m9>-1){
        brwsr ="MSIE 9.0";
    }else if (m8>-1){
        brwsr ="MSIE 8.0";
    }
    
    return brwsr;
};





