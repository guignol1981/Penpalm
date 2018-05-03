let User = require('../models/user');
let Postcard = require('../models/postcard');
let moment = require('moment');

module.exports.fetch = function(req, res) {
	User.findById(req.auth.id)
		.populate('penPal')
		.exec()
		.then(user => {
			if (!user.penPal) {
				res.send({
					msg: 'News fetched',
					data: {
						title: 'We are still looking for a pen pal for you!'
					}
				});

				return;
			}

			Postcard.find({recipient: user._id, seen: false})
				.then(postcards => {
					User.populate(user.penPal, {path: 'preferences'}).then(penPal => {
						let penPalName = penPal.preferences.displayName ? penPal.name : 'your pen pal';
						let penPalPhotoUrl = penPal.preferences.displayPicture ? penPal.photoData : null;

						res.send({
							msg: 'News fetched',
							data: {
								title: 'You have ' + postcards.length + ' new message(s) from ' + penPalName,
								imageUrl: penPalPhotoUrl
							}
						});
					});
				});
		});
};