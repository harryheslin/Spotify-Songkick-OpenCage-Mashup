var express = require('express');
var router = express.Router();
const qs = require('querystring');

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log("Query Data!")
  //const q = qs.parse(req.query);
  console.log(req.query);
  //res.send('Songkick Page');
  res.render('index', {title: "Hello"});
});


module.exports = router;
