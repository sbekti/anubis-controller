var models  = require('../models');
var express = require('express');
var async = require('async');
var router  = express.Router();

var RESTClient = require('node-rest-client').Client;
var rest = new RESTClient();

router.get('/devices', function(req, res) {
  models.Device
    .findAll({attributes: ['id', 'name', 'state']})
    .then(function(devices) {
      res.send(devices);
    });
});

router.post('/devices', function(req, res) {
  var id = req.body.id;
  var newState = req.body.state;

  async.waterfall([
    function(callback) {
      models.Device
        .findById(id)
        .then(function(device) {
          callback(null, device);
        })
        .catch(function(err) {
          callback(err)
        });
    },
    function(device, callback) {
      var args = {
        data: {state: newState},
        headers: {'Content-Type': 'application/json'}
      };
      rest.post(device.url, args, function(data, response) {
        callback(null, device);
      }).on('error', function(err) {
        callback(err);
      });
    },
    function(device, callback) {
      device.state = newState;
      device
        .save()
        .then(function(updatedDevice) {
          callback(null, updatedDevice);
        })
        .catch(function(err) {
          callback(err)
        });
    },
    function(device, callback) {
      var plainDevice = device.get({plain: true});
      delete plainDevice['url'];
      req.io.emit('device:state', plainDevice);
      callback(null, plainDevice);
    }
  ], function (err, device) {
    if (err) {
      console.log(err);
    } else {
      res.send(device);
    }
  });
});

module.exports = router;
