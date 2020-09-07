const axios = require('axios');
const songkick = require('./songkick.js');

let methods = {};
let topArtistData = [];

// Filter Spotify Data into an array with Username, Artists & Artist images
async function filterSpotifyData(spotifyApiData) {
    const username = spotifyApiData[0].body.display_name;
    topArtistData = [username];
    for (i = 1; i < 21; i += 2) {
        topArtistData[i] = spotifyApiData[1].data.items[i].name;
        topArtistData[i + 1] = spotifyApiData[1].data.items[i].images[0].url
    }
}

// Call functions to retrieve all API data and render index page
methods.retrieveApiData = async function(req, res, spotifyApi) {
    let spotifyApiData = [];
    let topArtistsGigs = [];
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
        await filterSpotifyData(spotifyApiData);
        topArtistsGigs = await songkick.retrieveSongkickData(topArtistData);
        res.render('index', { title: "Gig Guide", spotify: topArtistData, songkick: topArtistsGigs });
    }
    catch (err) {
        console.log(err);
        res.render('error', { error: err});
    }
}

module.exports = methods;
