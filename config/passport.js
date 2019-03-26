const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
// bring in user model
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
   passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
         .then((user) => {
            if (user){ // user has been found
               return done(null, user); 
            }
            return done(null, false);
         })
         .catch((err) => console.log(err));
   }));
};
// jwt_payload includes that same information that is in the const payload in users.js: name, id, avatar