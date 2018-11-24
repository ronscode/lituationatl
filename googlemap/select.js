function getSelectValue(){

    e = document.getElementById("mySelect");
    placeType = e.options[e.selectedIndex].value;
    if (placeType == 'bar'){
  
      request = {
        location: mapCenter,
        radius: '4828.03',
        type: ['bar']
    }
  
    }else if(placeType == 'night_club'){
      request = {
        location: mapCenter,
        radius: '4828.03',
        type: ['night_club']
      }
    }else if(placeType == 'shopping_mall'){
      request = {
        location: mapCenter,
        radius: '4828.03',
        type: ['shopping_mall']
      }
    }
  
  
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
  
  }