let User = require('../models/user');
let DeletedAccountMail = require('../models/deleted-account-mail');

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
		});
};

module.exports.remove = function(req, res) {
	User.findById(req.auth.id)
		.populate('penPal')
		.exec()
		.then(user => {
			let deletedAccountMail = new DeletedAccountMail({
				email: user.email,
				creationDate: Date.now()
			});

			deletedAccountMail.save().then(() => {
				if (user.penPal) {
					user.penPal.penPal = null;
					user.penPal.save().then(() => {
						user.remove().then(() => {
							res.send({
								msg: 'account deleted',
								data: null
							});
						});
					});
				} else {
					user.remove().then(() => {
						res.send({
							msg: 'account deleted',
							data: null
						});
					});
				}
			});
		});
};
