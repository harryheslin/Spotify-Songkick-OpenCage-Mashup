const opencage = require('./opencage.js');
const Songkick = require('songkick-api-node');

const songkickApi = new Songkick(process.env.SONGKICK_KEY);

let methods = {};

methods.retrieveSongkickData = async function (spotifyData) {
  let concerts = [];
  concerts = await songkickRequest(spotifyData);
  return concerts;
}

//Songkick API Request Function
async function songkickRequest(spotifyData) {
  let concertData = [];
  let topArtistsGigs = [];

  //Requesting all concert data for 10 most popular spotify artists
  for (i = 1; i < spotifyData.length; i += 2) {
    try {
      if (concertData.push(await songkickApi.searchEvents({ artist_name: spotifyData[i] }))) {
        concertData.push(spotifyData[i]);
        concertData.push(spotifyData[i + 1]);
      }
    }
    catch {
      console.log("Issues with connection to Songkick API");
    }
  }

  //Filtering concert results for shows occuring only in Australia
  for (i = 0; i < concertData.length; i+=3) {
    try {
      for (k = 0; k < concertData[i].length; k++) {
        if (concertData[i][k].venue.metroArea.country.displayName === "Australia") {
          let data = {};
          data.event = concertData[i][k];
          data.artist = concertData[i + 1];
          data.image = concertData[i + 2];
          data.coordinates = await opencage.forwardGeocode(concertData[i][k].venue.displayName + ", Australia");
          topArtistsGigs.push(data);
        } 
      }
    } catch {
      console.log("No Australian Gigs found");
    }
  }
  return topArtistsGigs;
}

module.exports = methods;
