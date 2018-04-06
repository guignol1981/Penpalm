let User = require('../models/user');
let Preference = require('../models/preference');

module.exports.get = function(req, res) {
	User.findById(req.auth.id)
		.populate('penPal')
		.populate('preferences')
		.exec()
		.then(user => {
			res.send({
				msg: 'User found',
				data: user
			});
		})
};

module.exports.update = function(req, res) {
	User.findById(req.auth.id)
		.populate('penPal')
		.populate('preferences')
		.exec()
		.then(user => {
			let preferences = user.preferences;

			preferences.displayImage = req.body['preferences']['displayImage'];
			preferences.displayName = req.body['preferences']['displayName'];
			preferences.emailNotifications = req.body['preferences']['emailNotifications'];

			preferences.save().then(() => {
				res.send({
					msg: 'User updated',
					data: user
				});
			});
		})
};
