var db = require("../db");

var userSchema = new db.Schema({
    email:          { type: String, required: true, unique: true },
    fullName:       { type: String, required: true },
    passwordHash:   String,
    userDevices:    [ String ],
    lastAccess:     { type: Date, default: Date.now }
});

var User = db.model("User", userSchema);

module.exports = User;


/* This file defines the schema for the users within the database. The only variables that are required
as of right now are the email and name however we will likely be adding a password requirement including
lenght and complexity.
*/