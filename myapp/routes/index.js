var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Login'});
});

router.get('/juicer', function (req, res, next) {
  var data = {
    list: [
      {name: ' guokai', show: true},
      {name: ' benben', show: false},
      {name: ' dierbaby', show: true}
    ],
    blah: [
      {num: 1},
      {num: 2},
      {
        num: 3, inner: [
        {'time': '15:00'},
        {'time': '16:00'},
        {'time': '17:00'},
        {'time': '18:00'}
      ]
      },
      {num: 4}
    ]
  };
  res.render('juicer', data);
});

module.exports = router;
