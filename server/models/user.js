let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Preference = require('../models/preference');

let UserSchema = new Schema({
	name: {type: String, require: true},
	email: {
		type: String, required: true,
		trim: true,
		match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	},
	photoUrl: {type: String},
	provider: {
		type: {
			id: String,
			token: String,
			source: String
		},
		select: false
	},
	penPal: {type: Schema.Types.ObjectId, ref: 'User', default: null},
	preferences: {type: Schema.Types.ObjectId, ref: 'Preference', default: new Preference()},
	active: {type: Boolean, default: true}
});

UserSchema.statics.upsertSocialUser = function(accessToken, refreshToken, profile, cb) {
	let that = this;

	return this.findOne({
		'provider.id': profile.id
	}, function(err, user) {
		if (!user) {
			let preference = new Preference();
			preference.save().then(preference => {
				let newUser = new that({
					name: profile.name.givenName,
					email: profile.emails[0].value,
					photoUrl: profile.photos ? profile.photos[0].value : profile._json.picture,
					provider: {
						id: profile.id,
						token: accessToken,
						source: profile.provider
					},
					preferences: preference
				});
				newUser.matchPenPal((user) => {
					user.save(function(error, savedUser) {
						if (error) {
							console.log(error);
						}
						return cb(error, savedUser);
					});
				});
			});
		} else {
			return cb(err, user);
		}
	});
};

UserSchema.methods.matchPenPal = function(callback) {
	this.model('User')
		.findOne()
		.where('penPal')
		.eq(null)
		.exec()
		.then(penPal => {
			if (penPal) {
				this.penPal = penPal;
				penPal.penPal = this;
				penPal.save().then(() => {
					callback(this);
				});
			} else {
				callback(this);
			}
		});
};

let User = mongoose.model('User', UserSchema);
module.exports = User;