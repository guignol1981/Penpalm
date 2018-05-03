let passport = require('passport');
let FacebookStrategy = require('passport-facebook-token');
let User = require('../models/user');
let clientID = process.env.NODE_ENV === 'prod' ? '1788186814836142' : '1055819054566173';
let clientSecret = process.env.NODE_ENV === 'prod' ? '7f210335c7b72e642a5c0e40130d055a' : 'a730aee798715d24dad31aae106f7673'

passport.use(new FacebookStrategy({
		clientID: clientID,
		clientSecret: clientSecret
	},
	function(accessToken, refreshToken, profile, done) {
		User.upsertSocialUser(accessToken, refreshToken, profile, function(err, user) {
			return done(err, user);
		});
	})
);