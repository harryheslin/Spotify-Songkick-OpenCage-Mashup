var express = require('express');
var router = express.Router();
const qs = require('querystring');

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log("Query Data!")
  const data = req.query.spotify.split(",");

  //Removing uneccesary data formatting 
  data[0] = data[0].substring(2, data[0].length - 1);
  for (i = 1; i < data.length; i++){
    data[i] = data[i].substring(1, data[i].length - 1);
  }
  console.log(data);

  //res.send('Songkick Page');
  res.render('index', {title: "Hello", spotify: data});
});


module.exports = router;
