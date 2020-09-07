const express = require('express');
const mashup = require('../methods/spotify.js');
const router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

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
    if (redirectUri == undefined || spotifyClientID == undefined || spotifySecret == undefined) {
        res.render('error', { error: "Please ensure keys in .env file are defined" })
    }
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
                mashup.retrieveApiData(req, res, spotifyApi);
            })
            .catch((e) => {
                console.log('Something went wrong!', e);
                res.render('error', { error: e});
            })
    } else {
        res.redirect('/');
    }
});

module.exports = router;