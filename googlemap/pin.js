
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
      Vote for this location:
      <div class = "d-flex">
        <button onclick = ""class = "bg-light" id = "like">like: </button>
        <button class = "bg-light">nah fam:</button>
      </div>
      <br />
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