let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let newsFactory = require('../services/news-factory');

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
	news: {type: Schema.Types.ObjectId, ref: 'News'}
});

UserSchema.statics.upsertSocialUser = function(accessToken, refreshToken, profile, cb) {
	let that = this;

	return this.findOne({
		'provider.id': profile.id
	}, function(err, user) {
		if (!user) {
			let newUser = new that({
				name: profile.name.givenName,
				email: profile.emails[0].value,
				photoUrl: profile.photos ? profile.photos[0].value : profile._json.picture,
				provider: {
					id: profile.id,
					token: accessToken,
					source: profile.provider
				}
			});
			newUser.matchPenPal((user) => {
				user.save(function(error, savedUser) {
					if (error) {
						console.log(error);
					}
					return cb(error, savedUser);
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
				newsFactory.match(penPal, (news) => {
					this.news = news;
					newsFactory.match(this, (news) => {
						penPal.news = news;
						penPal.save().then(() => {
							callback(this);
						});
					});
				});
			} else {
				newsFactory.noMatch(
					(news) => {
						this.news = news;
						callback(this);
					}
				);
			}
		});
};

let User = mongoose.model('User', UserSchema);
module.exports = User;