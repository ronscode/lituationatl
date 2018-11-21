/*This function places marker on the map and pans to new center
    after panning to new center it will make another service request for nearby places
    and re render for new locations with in a certain radius
 */
function placeMarkerAndPanTo(latLng, map) {
    userPin = new google.maps.Marker({
      position: latLng,
      title: "You are here",
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP
      
    });


    //bounce pin
    //userPin.addListener('click', toggleBounce);

    map.panTo(latLng)

    lat = latLng.lat()
    lng = latLng.lng()

    mapCenter = new google.maps.LatLng(lat,lng);
    
    var request = {
        location: mapCenter,
        radius: '4828.03',
        type: [type]
    }

    

    var infowindow = new google.maps.InfoWindow({
        content: pinContent()
    });

    google.maps.event.addListener(userPin, 'click', function(){
        infowindow.open(map, userPin);
    });

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);


    return userPin;
}




  function pinContent(){
      
      var content =`<div class="d-flex">
      <p>Comment:</p>
      </div>
      <span style="font-size:20px;cursor:pointer" onclick="openNav()">&#9776; leave a note:</span>
      </div>`
      return content;
  }


  function toggleBounce() {
    if (userPin.getAnimation() !== null) {
      userPin.setAnimation(null);
    } else {
      userPin.setAnimation(google.maps.Animation.BOUNCE); 
    
    }
   }




//    function theMakerTheUserDropped() {
//     for (var i = 0; i < userDrop.length; i++) {
//         pinDrop.push(placeMarkerAndPanTo(userDrop[i]));
//       }
//     }