let schedule = require('node-schedule');
let mailer = require('../services/mailer');
let User = require('../models/user');
let Postcard = require('../models/postcard');

let newMessageRule = new schedule.RecurrenceRule();
newMessageRule.minute = 1;

let newPenPalRule = new schedule.RecurrenceRule();
newPenPalRule.dayOfWeek = 0;

schedule.scheduleJob(newMessageRule, function() {
	console.log('sending new message mails!');
	User.find()
		.where('penPal')
		.ne(null)
		.exec()
		.then(users => {
			users.forEach((user) => {
				Postcard.count({'recipient': user._id, 'seen': false}).then(count => {
					if (count > 0) {
						let postcardWord = count > 1 ? 'postcards' : 'postcard';
						// mailer.sendMail({
						// 	from: '"Fred Foo 👻" <foo@example.com>',
						// 	to: user.email,
						// 	subject: 'You have new ' + postcardWord + '!',
						// 	text: 'Hello! ' + user.name + '! You have ' + count + ' new ' + postcardWord + ' waiting to be read!',
						// 	html: '<b>Hello world?</b>'
						// });
					}
				});
			});
		});
});

schedule.scheduleJob(newPenPalRule, function() {
	console.log('shuffling pen pals!');
});