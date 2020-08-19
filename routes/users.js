var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log("Query Data!")
  console.log(req.query.valid);
  res.send('User Page');
});


module.exports = router;
