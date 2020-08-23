const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');


let spotifyApiData = []

const scopes = ['user-read-private', 'user-read-email', 'user-top-read'];
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
const spotifyClientID = process.env.SPOTIFY_CLIENT_ID;
const spotifySecret = process.env.SPOTIFY_SECRET;

let spotifyApi = new SpotifyWebApi({
    clientId: spotifyClientID,
    clientSecret: spotifySecret,
    redirectUri: redirectUri,
});

// Authorize spotify API access
router.get('/', (req, res) => {
    authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeURL + "&show_dialog=true");
})

// Request & Set the access token on the API object to use it in later calls
router.get('/authenticated', (req, res) => {
    if (req.query.code) {
        let code = req.query.code;
        spotifyApi.authorizationCodeGrant(code)
            .then((data) => {
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);
                spotifyData(req, res);
            })
            .catch((e) => {
                console.log('Something went wrong!', e);
                res.redirect('/');
            })
    } else {
        res.redirect('/');
    }
});

// Compile spotify data into query string for songkick API
router.get('/songkickPage', (req, res) => {
    const username = spotifyApiData[0].body.id;
    let artists = [username];

    for (i = 1; i < 21; i += 2) {
        artists[i] = spotifyApiData[1].data.items[i].name;
        artists[i + 1] = spotifyApiData[1].data.items[i].images[0].url
    }
    res.redirect("/songkick?" + qs.stringify({ 'spotify': JSON.stringify(artists) }));
})

// Request Spotfy data:Username & Top 10 user artists
async function spotifyData(req, res, next) {
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
        await res.redirect(`/songkickPage`);
    }
    catch (err) {
        console.log(err);
        res.redirect('/');
        //res.render('error', { message: "Oops Something Went Wrong With the Spotify Data", error: err });
    }
}

module.exports = router;