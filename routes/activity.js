var express = require('express');
var router = express.Router();
var activity=require("../models/activity");
router.post('/addEvent', function(req, res, next) {
  var newactivity = new activity( {
          deviceId: req.body.deviceId,
	  longitute: req.body.longitute,
	latitude:req.body.latitude,//can't create an nested location object
           date:req.body.date,
           exposure: req.body.exposure,
           speed:  req.body.speed,
           apikey:req.body.apikey
        }); 
      newactivity.save( function(err,activity) {
           if (err) {
              // Error can occur if a duplicate email is sent
              res.status(400).json( {success: false, message: err.errmsg});
           }
           else {
               res.status(201).json( {success: true, message: " has been posted."})
           }
        });
});






module.exports = router;
