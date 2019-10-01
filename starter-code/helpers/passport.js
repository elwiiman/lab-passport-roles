// requires the model with Passport-Local Mongoose plugged in
const User = require("../models/User");

// require a the passport strategy
const { Strategy: LocalStrategy } = require("passport-local");
const passport = require("passport");

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
