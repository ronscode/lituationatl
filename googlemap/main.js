var map;
var marker;
var service;
var infowindow;
var place ;
var lat = 33.779401;
var lng = -84.370319;
var markers =[];
var places = [];
var youAreHere ={
    lat,
    lng
};


var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
	//alert("Your location is " + position.coords.latitude + " " + position.coords.longitude);
	
}

getLocation();





function initialize() {
   
 var mapCenter = new google.maps.LatLng(lat,lng);

  map = new google.maps.Map(document.getElementById('map'), {
    center: mapCenter,
    zoom: 15,
  });

  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
  });

  

  var request = {
    location: mapCenter,
    radius: '8047',
    type: ['bar']

    // query: 'Clark Atlanta University',
    //fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry']
  };
  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        places.push(results[i]);
      }
    }
}


 // creating markers for render based of types  ex--> type: ['bar']
function createMarker(place){

    //location for marker
    var placeLoc = place.geometry.location; 
    marker = new google.maps.Marker({
        map: map,
        position: placeLoc,

        
    });

    //Name of location will hover over pin when clicked
    google.maps.event.addListener(marker, 'click', function(){
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });




    return marker;
}

// --------------------------------------------------------------


function placeMarkerAndPanTo(latLng, map) {
    marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });
    map.panTo(latLng)

    lat = latLng.lat()
    lng = latLng.lng()

    mapCenter = new google.maps.LatLng(lat,lng);
    
    var request = {
        location: mapCenter,
        radius: '8047',
        type: ['bar']
    }

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

  }


// --------------------------------------------------------------


  

function showMarkers() {

    for (var i = 0; i < places.length; i++) {
  
        markers.push(createMarker(places[i]));
      }


}


function hideMarkers() {
    for(var marker in markers){
        markers[marker].setMap(null)
    }
    markers =[];
}

google.maps.event.addDomListener(window, 'load', initialize);





