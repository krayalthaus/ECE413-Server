var express = require('express');
var router = express.Router();
var Activity = require("../models/activity");

/*The addEvent post will create a new activity and be triggered on the device*/
router.post('/addEvent', function(req, res, next) {
  var newactivity = new Activity( {
          deviceId: req.body.deviceId,
          longitute: req.body.longitute,
        latitude:req.body.latitude,//can't create an nested location object
          // date:req.body.date,
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
res.status(201).json( {success: true, message: " has been posted$" });}
});
  });

/* This post will find all of the activity logs for a given device id and return an array of these activities  */
router.post('/info', function(req, res, next) {
    try {
      var userStatus = {};
      userStatus['success'] = true;
      
      var findId = req.body.deviceId;
      Activity.find({deviceId: req.body.deviceId}, function(err, activities) {
        if (!err) {
          var activityList = [];
          for (activity of activities) {
            activityList.push({
              deviceId: activity.deviceId,
              longitude: activity.longitude,
              latitude:activity.latitude,
              exposure: activity.exposure,
              speed: activity.speed
            });
          }
          userStatus['activities'] = activityList;
          return res.status(200).json(userStatus);
        }
        else {
          return res.status(201).json(userStatus);
        }
      });
    }
    catch (ex){
      res.status(400).json( {success: false, message: err.errmsg });
    }


});





module.exports = router;
