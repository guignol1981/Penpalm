let passport = require('passport');
let FacebookStrategy = require('passport-facebook-token');
let User = require('../models/user');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
        clientID: '1788186814836142',
        clientSecret: '7f210335c7b72e642a5c0e40130d055a'
    },
    function (accessToken, refreshToken, profile, done) {
        User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
            return done(err, user);
        });
    })
);