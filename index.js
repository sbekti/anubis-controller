var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var models = require('./models');
var routes = require('./routes/index');
var api = require('./routes/api');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(function(req, res, next) {
  req.io = io;
  next();
});

app.use('/', routes);
app.use('/api/v1/', api);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

models.sequelize.sync().then(function () {
  var server = http.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });

  models.Device.findOrCreate({
    where: {name: 'Bed Room'},
    defaults: {
      state: 0,
      url: 'http://192.168.2.10:3000/api/v1/switch'
    }
  });
});
