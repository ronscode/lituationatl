const database = firebase.database();




var map;
var marker;
var service;
var infowindow;
var userPinInfo;
var place ;
var iconBase;
var lat = 33.7490;
var lng = -84.3880;
var userPin;
var e ;//= document.getElementById("mySelect");
var placeType = ' ';// = e.options[e.selectedIndex].value;
var clicks =0;
var markers =[];
var places = [];
var pinDrop = [];
var userDrop =[];
var request = {};
var currentTimeStamp;

var youAreHere ={
    lat,
    lng
};
/**
      * Data object to be written to Firebase.
      */
var data = {
  sender: null,
  timestamp: null,
  lat: null,
 lng: null
 };

 var commentBtn = document.querySelector(".commentBtn");

var litLocation = database.ref(`lit-location/`);


var x = document.getElementById("demo");
//------------------------------------------
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
// ----------------------------------------

function init() {
   
 var mapCenter = new google.maps.LatLng(lat,lng);

  map = new google.maps.Map(document.getElementById('map'), {
    center: mapCenter,
    zoom: 15,
    // mapTypeId: 'roadmap'
    //--styling 
     styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{visibility: "off"}]
        
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ]

  });

  // adds pin to map and marker becomes new center
  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
  });


  // Listen for clicks and add the location of the click to firebase.
    map.addListener('click', function(e) {
    data.lat = e.latLng.lat();
    data.lng = e.latLng.lng();

    var timestamp2 = Math.floor(Date.now() / 1000);


  var pinDropLoc = database.ref(`lit-location/${timestamp2}`).update(data);

  currentTimeStamp = timestamp2;



  });
  console.log(data);

  commentBtn.addEventListener('click', writeComment);


  function writeComment() {
    var firstName = document.getElementById("fname").value;
        var lastName = document.getElementById("lname").value;
        var name = `${firstName} ${lastName}`;
        var commentInput = document.getElementById("commentBox").value;

        if(firstName == "" || lastName == "" || commentInput == ""){
          alert("Please fill in all fields to leave a comment.");
          return
        }

        database.ref(`lit-location/${currentTimeStamp}/comments`).push({
    
          fullName: name,
          comment: commentInput
    
        });

        document.getElementById("fname").value = "";
        document.getElementById("lname").value = "";
        document.getElementById("commentBox").value = "";
      
  }
 

  request = {
    location: mapCenter,
    radius: '4828.03',
    type: [placeType]

    // query: 'Clark Atlanta University',
    //fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry']
  };
  infowindow = new google.maps.InfoWindow();
  
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);


  // Search box------------------------------------------------------------------------------

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var placeMarkers = []
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
      
        if (places.length == 0) {
          return;
        }
      
        // Clear out the old markers.
        placeMarkers.forEach(function(marker) {
          marker.setMap(null);
        });
        placeMarkers = [];
      
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };
      
          // Create a marker for each place.
          placeMarkers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));
      
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
// Search box end -------------------------------------------------------------------------
}

function callback(results, status) {
  console.log(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {//PlacesServiceStatus
      places =[];
      for (var i = 0; i < results.length; i++) {
        places.push(results[i]);
      }
    }
}


//  creating markers for render based of t ypes  ex--> type: ['bar']
function createMarker(place){


  // console.log(place);
    //location for marker
    iconBase = '/images/';
    var placeLocation = place.geometry.location; 
    marker = new google.maps.Marker({
        map: map,
        position: placeLocation,
        animation: google.maps.Animation.DROP
    
    });

    
   

    //This is the string that includes the name and the uber icon link.
    var contentString = `
        <div class="">
            <strong>${place.name}</strong></br>

            <strong>Rating: ${place.rating} stars</strong></br>
            ${place.vicinity}:</br>
            <strong>${place.opening_hours.open_now ? 'OPEN':'CLOSED!!!'}</strong></br>
            Price Level: ${place.price_level }
        </div>
        <div>
        <a href="https://m.uber.com/looking" target="_blank" alt="Summon Uber!!"title="Summon Uber!"><img src="../images/uber-icon.png" alt="Summon Uber" width="20px" height="20px"/></a>
        <a href="https://ride.lyft.com" target="_blank" title="Need a Lyft?"><img src="../images/lyft-icon.png" width="30px" height="20px"/></a>
        </div>
    `

    
    //When you click on the marker, the uber icon appears in the info window. 
    //Name of location will hover over pin when clicked
    google.maps.event.addListener(marker, 'click', function(){
        infowindow.setContent(contentString);
        infowindow.open(map, this);
    });


    return marker;
}

//shows markers when "lit spy" is clicked
function showMarkers() {
    hideMarkers();
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

google.maps.event.addDomListener(window, 'load', init);

