var map;
var marker;
//var x = document.getElementById("demo");
var youAreHere ={
    lat: 33.7490,//coords.latitude, 
    lng :-84.3880// coords.longitude
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


function initMap() {
   
map = new google.maps.Map(document.getElementById('map'), {
    center: youAreHere,
    zoomControl: true,
    zoom: 10
});
}

// function initMap() {
//     var myLatLng = youAreHere;
  
//     map = new google.maps.Map(document.getElementById('map'), {
//       zoom: 4,
//       center: myLatLng
//     });
  
//     marker = new google.maps.Marker({
//       position: myLatLng,
//       map: map,
//       title: 'Hello World!'
//     });
//   }
  
getLocation();




