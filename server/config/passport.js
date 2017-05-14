'use strict';

/*!
 * Module dependencies.
 */
const User = require('../../models/user');
const local = require('../passport/local');
// const google = require('./passport/google');
// const facebook = require('./passport/facebook');
// const twitter = require('./passport/twitter');
// const linkedin = require('./passport/linkedin');
// const github = require('./passport/github');

/**
 * Expose
 */

module.exports = function (passport) {

    // serialize sessions
    // passport.serializeUser((user, cb) => cb(null, user.id));
    // passport.deserializeUser((id, cb) => User.load({ criteria: { _id: id } }, cb));

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.load({ criteria: { _id: id } }, function (err, user) {
            done(err, user);
        });
    });

    // use these strategies
    passport.use(local);
    // passport.use(google);
    // passport.use(facebook);
    // passport.use(twitter);
    // passport.use(linkedin);
    // passport.use(github);
};
