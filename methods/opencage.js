const opencage = require('opencage-api-client');

let methods = {};

//Resolving coordinates based on the Songkick provided venue name
methods.forwardGeocode = async function (location) {
    try{
        data = await opencage.geocode({ q: location, key: process.env.OCD_API_KEY })
        return data.results[0].geometry;
    } catch(error) {
        console.log('error', error.message);
        return;
    };
}

module.exports = methods;
