let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let newsFactory = require('../services/news-factory');

let UserSchema = new Schema({
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
	newsList: [{type: Schema.Types.ObjectId, ref: 'News', default: []}]
});

UserSchema.statics.upsertSocialUser = function(accessToken, refreshToken, profile, cb) {
	let that = this;

	return this.findOne({
		'provider.id': profile.id
	}, function(err, user) {
		if (!user) {
			let newUser = new that({
				email: profile.emails[0].value,
				photoUrl: profile.photos ? profile.photos[0].value : profile._json.picture,
				provider: {
					id: profile.id,
					token: accessToken,
					source: profile.provider
				},
				newsList: []
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
					this.newsList.push(news);
					newsFactory.match(this, (news) => {
						penPal.save().then(() => {
							penPal.newsList.push(news);
							callback(this);
						});
					});
				});
			} else {
				newsFactory.noMatch(
					(news) => {
						this.newsList.push(news);
						callback(this);
					}
				);
			}
		});
};

let User = mongoose.model('User', UserSchema);
module.exports = User;