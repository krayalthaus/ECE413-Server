var db = require("../db");

var activitySchema = new db.Schema({
   longitute:       { type: [Number], index: '2dsphere'},
latitute:       { type: [Number], index: '2dsphere'},   
 date:           Date,
    exposure:       Number,
    speed:          Number,
    userEmail:      String,
    deviceId:       String
});

var Activity = db.model("Activity", activitySchema);

module.exports = Activity;
