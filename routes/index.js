const express = require('express');
const axios = require('axios');
const qs = require('querystring');
var SpotifyWebApi = require('spotify-web-api-node');
const router = express.Router();

let spotifyApiData = []

//Make these .env variables
const scopes = ['user-read-private', 'user-read-email', 'user-top-read'];
const redirectUri = 'http://localhost:3000/success';
const spotifyClientID = '06ed07e26efa419c9e7e30b4e0658c5e';
const spotifySecret = "1d0d23b87af440788dabb8c99e85ac89";

let spotifyApi = new SpotifyWebApi({
  clientId: spotifyClientID,
  clientSecret: spotifySecret,
  redirectUri: redirectUri,
});


router.get('/', (req, res) => {
  authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL + "&show_dialog=true");
})

router.get('/homepage', (req, res) => {
  const username = spotifyApiData[0].body.id;
  let artists = [username];
  for (i = 1; i < 21; i += 2) {
    artists[i] = spotifyApiData[1].data.items[i].name;
    artists[i + 1] = spotifyApiData[1].data.items[i].images[0].url
  }
  //console.log(qs.stringify(artists));
  res.redirect("/users?" + qs.stringify({ 'spotify': JSON.stringify(artists)}));
  //res.render('index');
})

router.get('/success', (req, res, next) => {

  if (req.query.code) {
    let code = req.query.code;
    spotifyApi.authorizationCodeGrant(code)
      .then((data) => {
        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        console.log(spotifyApi.getAccessToken());
        spotifyUserDetails(req, res);
        },
        function (err) {
        console.log('Something went wrong!', err);
        res.render('error', { message: "Oops Something Went Wrong With Spotify Authentication", error: err });
       }
    )
  } else {
    res.redirect('/');
  }
});

async function spotifyUserDetails(req, res, next) {
  const options = {
    headers: {
      Accept: 'application/json',
      ['Content-Type']: 'application/json',
      Authorization: 'Bearer ' + spotifyApi.getAccessToken()
    }
  };
  try {
    spotifyApiData[0] = await spotifyApi.getMe();
    spotifyApiData[1] = await axios.get('https://api.spotify.com/v1/me/top/artists?time_range=short_term', options);
    await res.redirect(`/homepage`);
  }
  catch (err) {
    console.log(err);
    res.render('error', { message: "Oops Something Went Wrong With Spotify Data", error: err });
  }
 }

module.exports = router;
