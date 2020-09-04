var express = require('express');
var opencage = require('./opencage.js');
var router = express.Router();
const qs = require('querystring');
const Songkick = require('songkick-api-node');

const songkickApi = new Songkick(process.env.SONGKICK_KEY);

let topArtistsGigs = [];
let spotifyData;

async function songkickData(req, res, next) {
  let concertData = [];
  topArtistsGigs = [];

  //Requesting concert data for 10 most popular spotify artists
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

  //Filtering concert results for shows occuring in Australia
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
  console.log(topArtistsGigs);
  for (i = 0; i < topArtistsGigs.length; i ++) {
    console.log(topArtistsGigs[i]);

  }
}

async function retrieveData(req, res, next) {
  await songkickData(req, res, next);
  res.render('index', { title: "Gig Guide", spotify: spotifyData, songkick: topArtistsGigs });
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  spotifyData = req.query.spotify.split(",");

  //Removing uneccesary spotifyData formatting 
  spotifyData[0] = spotifyData[0].substring(2, spotifyData[0].length - 1);
  for (i = 1; i < spotifyData.length; i++) {
    spotifyData[i] = spotifyData[i].substring(1, spotifyData[i].length - 1);
  }
  spotifyData[spotifyData.length - 1] = spotifyData[spotifyData.length - 1].substring(0, spotifyData[spotifyData.length - 1].length - 1);
  retrieveData(req, res, next);
 
});


module.exports = router;
