var db = require("../db");

var deviceSchema = new db.Schema({
    apikey:             String,
    deviceId:           String,
    userEmail:          String,
    deviceActivities:   [ String ]
});

var Device = db.model("Device", deviceSchema);

module.exports = Device;


/* This file defines the schema for the IoT devices being used within this project.
All devices will be registered using the deviceId and a user email, then an API key will
be created which will allow the software to validate the message.*/