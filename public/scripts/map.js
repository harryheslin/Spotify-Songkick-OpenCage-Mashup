let lat = -27.4698;
let lng = 153.0251;  
    var mymap = L.map('map').setView([lat, lng], 12);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',          maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1IjoiaGFycnloZXNsaW4iLCJhIjoiY2tlNnNkb213MTJuMTJxcXZ5aGdtbndqbCJ9.TTcRH7l0Q5f7Hmv3l5efvQ"
    }).addTo(mymap);