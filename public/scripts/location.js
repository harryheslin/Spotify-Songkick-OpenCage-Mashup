function showOnMap(event,venue,image, lat, lng) {
    console.log('Im here!' + lat + " " + lng)
    mymap.flyTo([lat, lng], 12);
    marker = L.marker([lat, lng]).addTo(mymap); 
    marker.bindPopup('<div id="popup"><img src = \'' + image + '\'width="35%"/><br />' + event + "<br />" +  venue + "</div>").openPopup();
  }

  function redirect(url) {
    location.href= url;
  }