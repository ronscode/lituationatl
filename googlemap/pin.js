/*This function places marker on the map and pans to new center
    after panning to new center it will make another service request for nearby places
    and re render for new locations with in a certain radius
 */
function placeMarkerAndPanTo(latLng, map) {
    iconBase = '/images/';
    userPin = new google.maps.Marker({
      position: latLng,
      title: "You are here",
      map: map,
      icon: iconBase + 'icon_lit.png',
      draggable: true,
      animation: google.maps.Animation.DROP
      
    });


    //bounce pin
    //userPin.addListener('click', toggleBounce);

    map.panTo(latLng)

    lat = latLng.lat()
    lng = latLng.lng()

    mapCenter = new google.maps.LatLng(lat,lng);
    
    request = {
        location: mapCenter,
        radius: '4828.03',
        type: [placeType]
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
      </div>
      <span style="font-size:20px;cursor:pointer" onclick="openNav()">&#9776; Like / Leave a note :</span>
        <div>
        <a href="https://m.uber.com/looking" target="_blank"><img src="../images/uber-icon.png" width="20px" height="20px"/></a>
        <a href="https://ride.lyft.com" target="_blank"><img src="../images/lyft-icon.png" width="30px" height="20px"/></a>
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