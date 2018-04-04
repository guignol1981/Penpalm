let News = require('../models/news');

module.exports.noMatch = function(callback) {
	let news = new News({
		title: 'We are looking for the perfect pen pal',
		body: 'You will be notified when you are matched',
		imageUrl: null
	});
	news.save().then(news => callback(news));
};

module.exports.match = function(penpal, callback) {
	let news = new News({
		title: 'Your penpal is named ' + penpal.name + '!',
		body: 'Go ahead and write a postcard',
	});
	news.save().then(news => callback(news));
};

module.exports.newPostcard = function(penpal, callback) {
	let news = new News({
		title: 'You have a new postcard from ' + penpal.name + '!',
		body: 'Go ahead and read the postcard',
		imageUrl: penpal.photoUrl
	});
	news.save().then(news => callback(news));
};

