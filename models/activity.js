var db = require("../db");

var activitySchema = new db.Schema({
    location:       { type: [Number], index: '2dsphere'},
    date:           Date,
    exposure:       Number,
    speed:          Number,
    userEmail:      String,
    deviceId:       String,
    apikey:         String
});

var Activity = db.model("Activity", activitySchema);

module.exports = Activity;
