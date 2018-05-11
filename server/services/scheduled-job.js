let schedule = require('node-schedule');
let mailer = require('../services/mailer');
let User = require('../models/user');
let Postcard = require('../models/postcard');
let pug = require('pug');

let newMessageRule = new schedule.RecurrenceRule();
newMessageRule.hour = 8;

let newPenPalRule = new schedule.RecurrenceRule();
newPenPalRule.dayOfWeek = 0;

schedule.scheduleJob(newMessageRule, function() {
	console.log('sending new message mails!');
	User.find()
		.exec()
		.then(users => {
			users.forEach((user) => {
				if (!user.enableEmailNotifications) {
					return;
				}

				Postcard.count({'recipient': user._id, 'seen': false}).then(count => {
					if (count > 0) {
						pug.renderFile('views/new-postcards.pug', {
							data: {
								count: count,
								baseUrl: process.env.BASE_URL || 'http://localhost:3000'
							}
						}, function(err, html) {
							mailer.sendMail({
								from: '"Penpalms" <info@penpalms.com>',
								to: user.email,
								subject: 'You have new postcard(s)!',
								text: '',
								html: html
							});
						});
					}
				});
			});
		});
});

// schedule.scheduleJob(newPenPalRule, function() {
// 	console.log('shuffling pen pals!');
// });