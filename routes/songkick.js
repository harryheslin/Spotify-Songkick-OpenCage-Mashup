var express = require('express');
var opencage = require('./opencage.js');
var router = express.Router();
const qs = require('querystring');
const Songkick = require('songkick-api-node');

const songkickApi = new Songkick(process.env.SONGKICK_KEY);

let topArtistsGigs = [];
let anotherlist = [];
let spotifyData;

async function songkickData(req, res, next) {
  let concertData = [];
  topArtistsGigs = [];

  //Requesting concert data for 10 most popular spotify artists
  for (i = 1; i < spotifyData.length; i += 2) {
    try {
      if (concertData.push(await songkickApi.searchEvents({ artist_name: spotifyData[i] }))) {
        concertData.push(spotifyData[i]);
      }
    }
    catch {
      console.log("Issues with connection to Songkick API");
    }
  }

  anotherlist = [];
  //Filtering concert results for shows occuring in Australia
  for (i = 0; i < concertData.length; i+=3) {
    try {
      for (k = 0; k < concertData[i].length; k++) {
        if (concertData[i][k].venue.metroArea.country.displayName === "Australia") {
          topArtistsGigs.push(concertData[i][k]);
          topArtistsGigs.push(concertData[i + 1]);
          anotherlist.push(await opencage.forwardGeocode(concertData[i][k].venue.displayName + ", Australia"));
        } 
      }
    } catch {
      console.log("No Australian Gigs found");
    }
  }
  //console.log(anotherlist);
  for (i = 0; i < topArtistsGigs.length; i += 2) {
    // console.log(topArtistsGigs[i].displayName);
    //console.log(topArtistsGigs[i]);
    //console.log(topArtistsGigs[i+1]);
  }
}

async function retrieveData(req, res, next) {
  await songkickData(req, res, next);
  console.log(anotherlist);
  res.render('index', { title: "Hello", spotify: spotifyData, songkick: topArtistsGigs });
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
