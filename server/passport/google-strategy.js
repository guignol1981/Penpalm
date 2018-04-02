let passport = require('passport');
let GoogleTokenStrategy = require('passport-google-token').Strategy;
let User = require('../models/user');

passport.use(new GoogleTokenStrategy({
        clientID: '591045054488-e7upjbeo2710idm0a00hhdbusmghfulh.apps.googleusercontent.com\n',
        clientSecret: 'eZDYKD12tJFXWv_ZBt_2tM2K'
    },
    function (accessToken, refreshToken, profile, done) {
        User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
            return done(err, user);
        });
    }
));