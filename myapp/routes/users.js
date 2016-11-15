var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/html', function (req, res, next) {
  res.send("public/pages/html.html");
});

module.exports = router;
