const opencage = require('opencage-api-client');

let methods = {};
methods.forwardGeocode = async function (location) {
    try{
        data = await opencage.geocode({ q: location, key: process.env.OCD_API_KEY })
        return data.results[0].geometry;
        //console.log(JSON.stringify(data));
        // if (data.status.code == 200) {
        //     if (data.results.length > 0) {
        //         var place = data.results[0];
                // console.log(place.formatted);
                // console.log(place.geometry);
                // console.log(place.annotations.timezone.name);
        //         return place.geometry;
        //     }
        // } else if (data.status.code == 402) {
        //     console.log('hit free-trial daily limit');
        //     console.log('become a customer: https://opencagedata.com/pricing');
        // } else {
        //     // other possible response codes:
        //     // https://opencagedata.com/api#codes
        //     console.log('error', data.status.message);
        //}
    } catch(error) {
        console.log('error', error.message);
        return;
    };
}

module.exports = methods;
