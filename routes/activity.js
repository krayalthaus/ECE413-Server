var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require("../models/users");
var Device = require("../models/device");
var Activity = require("../models/activity");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");
//--------------------------------------new addd-----------------
router.get('/getinfo', function(req, res){
//userStatus['success'] = true;
//return res.status(200).json(userStatus);});
Activity.findOne( { deviceId: req.body.deviceId }, function(err, activity) {   
  if (activity !== null) {
      if ( activity.apikey != req.body.apikey) {
        userStatus.status = "ERROR";
        userStatus.message = "Invalid apikey for device ID " + req.body.deviceId + ".";
        return res.status(201).send(JSON.stringify(responseJson));}
    
      else{ 
	          userStatus['success'] = true;
            userStatus['deviceId'] =activity.deviceId;
            userStatus['longitute'] = activity.longitute;
            userStatus['latitude'] = activity.latitude;
            userStatus['exposure'] =activity.exposure;
      return res.status(200).json(userStatus); 
      }}
  else {
      userStatus.status = "ERROR";
        userStatus.message = "Device ID " + req.body.deviceId + " not registered.";
        return res.status(201).send(JSON.stringify(userStatus)); 
    } 


  });
  userStatus['success'] = true;
  return res.status(200).json(userStatus);
});
//----------------------------------------------------------------

//POST: Create a new activity
router.post('/addEvent', function(req, res) {
  var responseJSON = {
    status: "",
    message: ""
  };
  
  //checking if there is a deviceId associated with the request
  if( !req.body.hasOwnProperty("deviceId") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing deviceId parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
  }
  //checking if there is a apikey associated with the request
  if( !req.body.hasOwnProperty("apikey") ) {
      responseJson.status = "ERROR";
      responseJson.message = "Request missing apikey parameter.";
      return res.status(201).send(JSON.stringify(responseJson));
  }
  //checking if there is a longitude associated with the request
  if( !req.body.hasOwnProperty("longitude") ) {
      responseJson.status = "ERROR";
      responseJson.message = "Request missing longitude parameter.";
      return res.status(201).send(JSON.stringify(responseJson));
  }
  //checking if there is a latitude associated with the request
  if( !req.body.hasOwnProperty("latitude") ) {
      responseJson.status = "ERROR";
      responseJson.message = "Request missing latitude parameter.";
      return res.status(201).send(JSON.stringify(responseJson));
  }
  //checking if there is a speed associated with the request
  if ( !req.body.hasOwnProperty("speed") ) {
      responseJSON.status = "ERROR";
      responseJSON.message = "Request missing speed parameter.";
      return res.status(201).send(JSON.stringify(responseJson));
  }
  //checking if there is a exposure associated with the request
  if ( !req.body.hasOwnProperty("exposure") ) {
    responseJSON.status = "ERROR";
    responseJSON.message = "Request missing exposure parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
}
  Device.findDevice( { deviceId: req.body.deviceId }, function(err, device) {   
    if (device !== null) {
      if ( device.apikey != req.body.apikey) {
        responseJson.status = "ERROR";
        responseJson.message = "Invalid apikey for device ID " + req.body.deviceId + ".";
        return res.status(201).send(JSON.stringify(responseJson));
      }
      else {  var userStatus = {};}
        var newactivity = new Activity( {
          deviceId: req.body.deviceId,
          longitute: req.body.longitute,
          latitude:req.body.latitude,//can't create an nested location object
          date:req.body.date,
          exposure: req.body.exposure,
         speed:  req.body.speed,
          apikey:req.body.apikey
        });    
        newactivity.save( function(err,Activity) {
          if (err) {
            // Error can occur if a duplicate email is sent
            res.status(400).json( {success: false, message: err.errmsg});
          }
          else {
            res.status(201).json( {success: true, message: " has been posted."});
          }
        });  }  
    else {
      responseJson.status = "ERROR";
        responseJson.message = "Device ID " + req.body.deviceId + " not registered.";
        return res.status(201).send(JSON.stringify(responseJson)); 
    }
userStatus['success'] = true;
            userStatus['deviceId'] =newactivity.deviceId;
            userStatus['longitute'] = newactivity.longitute;
            userStatus['latitude'] = newactivity.latitude;
             userStatus['exposure'] =newactivity.exposure;
 return res.status(200).json(userStatus); 
  });
});

// router.get("/getActivity" , function(req, res) {
//   // Check for authentication token in x-auth header
//   if (!req.headers["x-auth"]) {
//      return res.status(401).json({success: false, message: "No authentication token"});
//   }
  
//   var authToken = req.headers["x-auth"];
  
//   try {
//      var decodedToken = jwt.decode(authToken, secret);
//      var userStatus = {};
     
//      User.findOne({email: decodedToken.email}, function(err, user) {
//         if(err) {
//            return res.status(200).json({success: false, message: "User does not exist."});
//         }
//         else {
//           userStatus['success'] = true;
//           userStatus['email'] = user.email;
//           userStatus['fullName'] = user.fullName;
//           userStatus['lastAccess'] = user.lastAccess;
//           userStatus['device'] = user.userDevices;
           
//            // Find devices based on decoded token
//           Device.find({ userEmail : decodedToken.email}, function(err, devices) {
//            if (!err) {
//               // Construct device list
//               var deviceList = []; 
//               for (device of devices) {
//                 deviceList.push({ 
//                       deviceId: device.deviceId,
//                       apikey: device.apikey,
//                 });
//               }
//               userStatus['devices'] = deviceList;
//            }
//            return res.status(200).json(userStatus);      
//          });

//         //  Activity.find({ deviceId : devices }, function(err, activities) {

//         //     if (!err) {

//         //       var activityList = [];
//         //       for (activity of activities) {
//         //         activityList.push({
//         //           speed: activity.speed,
//         //           latitude: activity.latitude,
//         //           longitude: activity.longitude,
//         //           exposure: activity.exposure,
//         //           deviceId: activity.deviceId
//         //         });
//         //       }
//         //       userStatus['activities'] = activityList;
//         //     }

            
//         //  });
         
//         }
//      });
//   }
//   catch (ex) {
//      return res.status(401).json({success: false, message: "Invalid authentication token."});
//   }
  
// });

router.get("/getActivity" , function(req, res) {
  // Check for authentication token in x-auth header
  if (!req.headers["x-auth"]) {
     return res.status(401).json({success: false, message: "No authentication token"});
  }
  
  var authToken = req.headers["x-auth"];
  
  try {
     var decodedToken = jwt.decode(authToken, secret);
     var userStatus = {};
     
     User.findOne({email: decodedToken.email}, function(err, user) {
        if(err) {
           return res.status(200).json({success: false, message: "User does not exist."});
        }
        else {
           userStatus['success'] = true;
           userStatus['email'] = user.email;
           userStatus['fullName'] = user.fullName;
           userStatus['lastAccess'] = user.lastAccess;
           userStatus['device'] = user.userDevices;
           
           
           // Find devices based on decoded token
         Device.find({ userEmail : decodedToken.email}, function(err, devices) {
           if (!err) {
              // Construct device list
              var deviceList = []; 
              for (device of devices) {
                deviceList.push({ 
                      deviceId: device.deviceId,
                      apikey: device.apikey,
                });
              }
              userStatus['devices'] = deviceList;
           }
                 return res.status(200).json(userStatus);
                          
             });
        }
  });
}
  catch (ex) {
     return res.status(401).json({success: false, message: "Invalid authentication token."});
  }
  
});




module.exports = router;
