let Postcard = require('../models/postcard');
let User = require('../models/user');
let newsFactory = require('../services/news-factory');

module.exports.create = function(req, res) {
	User.findById(req.auth.id)
		.populate('penPal')
		.exec()
		.then(user => {
			let postcard = new Postcard({
				author: user.id,
				recipient: user.penPal._id,
				body: req.body.body,
				creationDate: new Date()
			});

			newsFactory.newPostcard(user, (news) => {
				user.penPal.news = news;
				user.penPal.save(() => {
					postcard.save().then(postcard => {
						res.send({
							msg: 'Postcard saved',
							data: postcard
						});
					});
				});
			});

		});
};

module.exports.inbox = function(req, res) {
	let url = require('url');
	let url_parts = url.parse(req.url, true);
	let query = url_parts.query;

	Postcard.count({'recipient': req.auth.id}).then(count => {
		Postcard.find({'recipient': req.auth.id})
			.skip(Number(query.skip))
			.limit(5)
			.exec()
			.then(postcards => {
				res.send({
					msg: 'Inbox retrieved',
					data: {
						postcards: postcards,
						count: count
					}
				});
			});
	});
};


module.exports.sent = function(req, res) {
	Postcard.find({'author': req.auth.id})
		.exec()
		.then(postcards => {
			res.send({
				msg: 'Sent postcards retrieved',
				data: postcards
			});
		});
};