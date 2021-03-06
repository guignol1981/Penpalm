let Postcard = require('../models/postcard');
let User = require('../models/user');

module.exports.create = function(req, res) {
	User.findById(req.auth.id)
		.populate('penPal')
		.exec()
		.then(user => {
			if (!req.body.body) {
				res.status(500).send({
					msg: 'The postcard do not have a body'
				});

				return;
			}

			let postcard = new Postcard({
				author: user.id,
				recipient: req.body.recipient,
				body: req.body.body,
				backSideOptionType: req.body.backSideOptionType,
				backSideValue: req.body.backSideValue,
				spotifyLink: req.body.spotifyLink,
				allowShare: req.body.allowShare,
				template: req.body.template,
				seen: false,
				creationDate: new Date()
			});

			postcard.save().then(postcard => {
				res.send({
					msg: 'Postcard saved',
					data: postcard
				});
			});
		});
};

module.exports.markSeen = function(req, res) {
	Postcard.findById(req.body._id)
		.exec()
		.then(postcard => {
			postcard.seen = true;
			postcard.save().then(postcard => {
				res.send({
					msg: 'Postcard updated',
					data: postcard
				});
			});
		});
};

module.exports.getInbox = function(req, res) {
	let url = require('url');
	let url_parts = url.parse(req.url, true);
	let query = url_parts.query;

	Postcard.count({'recipient': req.auth.id}).then(count => {
		Postcard.find({'recipient': req.auth.id})
			.populate('author')
			.skip(Number(query.skip))
			.limit(5)
			.sort({'creationDate': -1})
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

module.exports.getOutbox = function(req, res) {
	let url = require('url');
	let url_parts = url.parse(req.url, true);
	let query = url_parts.query;
	Postcard.count({'author': req.auth.id}).then(count => {
		Postcard.find({'author': req.auth.id})
			.populate('author')
			.skip(Number(query.skip))
			.limit(5)
			.sort({'creationDate': -1})
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

module.exports.getTotalCount = function(req, res) {
	Postcard.count().then(count => {
		res.send({
			msg: 'count found',
			data: count
		});
	});
};