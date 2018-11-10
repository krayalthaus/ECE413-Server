var express = require('express');
var router = express.Router();
var Device = require("../models/device");

router.post('/Register', function(req, res, next) {
    var responseJson = {
        status : "",
        message : ""
    }

    if (!req.body.hasOwnProperty("deviceID")) {
        responseJson.status = "Error";
        responseJson.message = "Request missing deviceId Parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }

    if( !req.body.hasOwnProperty("apikey") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing apikey parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }
    
    if( !req.body.hasOwnProperty("longitude") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing longitude parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }
    
    if( !req.body.hasOwnProperty("latitude") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing latitude parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }

    Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
        if (device !== null) {
           if (device.apikey != req.body.apikey) {
               responseJson.status = "ERROR";
               responseJson.message = "Invalid apikey for device ID " + req.body.deviceId + ".";
               return res.status(201).send(JSON.stringify(responseJson));
           }
           else {
               // Create a new device with user email
               var newDevice = new Device({
                  userEmail: device.userEmail,
                  deviceid: req.body.deviceId,
               });

               // Save device. If successful, return success. If not, return error message.                                                        
               newDevice.save(function(err, newDevice) {
                 if (err) {
                   responseJson.status = "ERROR";
                   responseJson.message = "Error saving data in db.";
                   return res.status(201).send(JSON.stringify(responseJson));
                 }
                 else {
                   responseJson.status = "OK";
                   responseJson.message = "Data saved in db with object ID " + newDevice._id + ".";
                   return res.status(201).send(JSON.stringify(responseJson));
                 }
               });
           }
        } 
        else {
           responseJson.status = "ERROR";
           responseJson.message = "Device ID " + req.body.deviceId + " not registered.";
           return res.status(201).send(JSON.stringify(responseJson));        
        }
    });

});

router.post('/Activity', function (req, res, next) {

    var reponseJson = {
        status : "",
        message : ""
    };

    if( !req.body.hasOwnProperty("deviceId") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing deviceId parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }

    if( !req.body.hasOwnProperty("apikey") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing apikey parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }
    
    if( !req.body.hasOwnProperty("longitude") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing longitude parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }
    
    if( !req.body.hasOwnProperty("latitude") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing latitude parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }
});


/* POST: Register new device. */
router.post('/hit', function(req, res, next) {

    var responseJson = { 
       status : "",
       message : ""
    };

    // Ensure the POST data include properties id and email
    if( !req.body.hasOwnProperty("deviceId") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing deviceId parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }

    if( !req.body.hasOwnProperty("apikey") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing apikey parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }
    
    if( !req.body.hasOwnProperty("longitude") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing longitude parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }
    
    if( !req.body.hasOwnProperty("latitude") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing latitude parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }

    // Find the device and verify the apikey
    Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
        if (device !== null) {
           if (device.apikey != req.body.apikey) {
               responseJson.status = "ERROR";
               responseJson.message = "Invalid apikey for device ID " + req.body.deviceId + ".";
               return res.status(201).send(JSON.stringify(responseJson));
           }
           else {
               // Create a new device with user email
               var newDevice = new Device({
                  userEmail: device.userEmail,
                  deviceid: req.body.deviceId,
               });

               // Save device. If successful, return success. If not, return error message.                                                        
               newDevice.save(function(err, newDevice) {
                 if (err) {
                   responseJson.status = "ERROR";
                   responseJson.message = "Error saving data in db.";
                   return res.status(201).send(JSON.stringify(responseJson));
                 }
                 else {
                   responseJson.status = "OK";
                   responseJson.message = "Data saved in db with object ID " + newDevice._id + ".";
                   return res.status(201).send(JSON.stringify(responseJson));
                 }
               });
           }
        } 
        else {
           responseJson.status = "ERROR";
           responseJson.message = "Device ID " + req.body.deviceId + " not registered.";
           return res.status(201).send(JSON.stringify(responseJson));        
        }
    });
});

module.exports = router;
