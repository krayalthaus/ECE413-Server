var db = require("../db");

var userSchema = new db.Schema({
    email:          { type: String, required: true, unique: true },
    fullName:       { type: String, required: true },
    passwordHash:   String,
    userDevices:    [ String ],
    activityDates:  [ Date ]
});

var User = db.model("User", userSchema);

module.exports = User;