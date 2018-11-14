var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require("../models/users");
var Device = require("../models/device");
var Activity = require("../models/activity");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");

/* Authenticate user */
var secret = "secret";

router.post('/signin', function(req, res, next) {
   User.findOne({email: req.body.email}, function(err, user) {
      if (err) {
         res.status(401).json({success : false, error : "Error communicating with database."});
      }
      else if(!user) {
         res.status(401).json({success : false, error : "The email or password provided was invalid."});         
      }
      else {
         bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
            if (err) {
               res.status(401).json({success : false, error : "Error authenticating. Please contact support."});
            }
            else if(valid) {
               var token = jwt.encode({email: req.body.email}, secret);
               res.status(201).json({success : true, token : token});         
            }
            else {
               res.status(401).json({success : false, error : "The email or password provided was invalid."});         
            }
         });
      }
   });
});

/* Register a new user */
router.post('/register', function(req, res, next) {

    // FIXME: Add input validation
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
        // Create an entry for the user
        var newUser = new User( {
           email: req.body.email,
           fullName: req.body.fullName,
           passwordHash: hash // hashed password
        }); 
        
        newUser.save( function(err, user) {
           if (err) {
              // Error can occur if a duplicate email is sent
              res.status(400).json( {success: false, message: err.errmsg});
           }
           else {
               res.status(201).json( {success: true, message: user.fullName + " has been created."})
           }
        });
    });    
});
//Following function not being used but I am scared to remove it :)
router.get("/activity" , function(req, res) {
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
            userStatus['device'] = user.userDevices;
            userStatus['activity'] = user.userDevices.deviceActivities;
             
             // Find devices based on decoded token
            //  Device.find({ userEmail : decodedToken.email}, function(err, devices) {
            //     if (!err) {
            //        // Construct device list
            //        var deviceList = []; 
            //        for (device of devices) {
            //            deviceList.push({ 
            //                  deviceId: device.deviceId,
            //                  apikey: device.apikey,
            //            });
            //        }
            //        userStatus['devices'] = deviceList;
            //     }
                var email = user.email;
                var deviceList = GetDeviceList(email);
                userStatus['devices'] = deviceList;
                userStatus['activities'] = GetActivities(deviceList);
              
                // Activity.find({ deviceId : user.userDevices }, function(err, activities) {
  
                //     if (!err) {
        
                //       var activityList = [];
                //       for (activity of activities) {
                //         activityList.push({
                //           speed: activity.speed,
                //           latitude: activity.latitude,
                //           longitude: activity.longitude,
                //           exposure: activity.exposure,
                //           deviceId: activity.deviceId
                //         });
                //       }
                //       userStatus['activities'] = activityList;
                //     }
        
                //     return res.status(200).json(userStatus); 
                //  });
                return res.status(200).json(userStatus);
            //});
  
           

           //return res.status(200).json(userStatus);
           
          }
       });
    }
    catch (ex) {
       return res.status(401).json({success: false, message: "Invalid authentication token."});
    }
    
  });

function GetDeviceList(userEmail) {
    var deviceList = [];

    Device.find({ userEmail : userEmail}, function(err, devices) {
    if (!err) {
        // Construct device list
        var deviceList = []; 
        for (device of devices) {
            deviceList.push({ 
                    deviceId: device.deviceId,
                    apikey: device.apikey,
            });
        }
    }
    
    });
    return deviceList;
}

function GetActivities(deviceList) {
    var activityList = [];
    for (var device of deviceList) {
        Activity.find({ deviceId : "123456" }, function(err, activities) {

            if (!err) {

            
            for (activity of activities) {
                activityList.push({
                speed: activity.speed,
                latitude: activity.latitude,
                longitude: activity.longitude,
                exposure: activity.exposure,
                deviceId: activity.deviceId
                });
            }
            
            }

        });
    }
    return activityList;
}

router.get("/account" , function(req, res) {
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
