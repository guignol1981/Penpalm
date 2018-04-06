let passport = require('passport');
let FacebookStrategy = require('passport-facebook-token');
let User = require('../models/user');

passport.use(new FacebookStrategy({
        clientID: '1055819054566173',
        clientSecret: 'a730aee798715d24dad31aae106f7673'
    },
    function (accessToken, refreshToken, profile, done) {
        User.upsertSocialUser(accessToken, refreshToken, profile, function (err, user) {
            return done(err, user);
        });
    })
);