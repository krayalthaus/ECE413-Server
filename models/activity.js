var db = require("../db");

var activitySchema = new db.Schema({
   longitude:  Number, //    { type: [Number], index: '2dsphere'},
    latitude:   Number,//    { type: [Number], index: '2dsphere'},   
    date:           Date,
    exposure:       Number,
    speed:          Number,
    userEmail:      String,
    deviceId:       String,
    activityId:     String
});

var Activity = db.model("Activity", activitySchema);

module.exports = Activity;


/*This file defines the schema used for an outdoor activity.
The numbers for longitude, latitude, exposure, and speed will all
come from the IoT devices being used. The deviceId will allow 
us to sort the activities by deviceId.*/