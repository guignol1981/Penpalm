'use strict';
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: 'xqshdvio7ytxihl4@ethereal.email',
		pass: 'VavhfQdxWeCbN6HD2n'
	}
});

let mailOptions = {
	from: '"Fred Foo 👻" <foo@example.com>',
	to: 'vincentguillemette1981@gmail.com',
	subject: 'Hello ✔',
	text: 'Hello world?',
	html: '<b>Hello world?</b>'
};

module.exports.sendMail = function (options) {
	transporter.sendMail(options, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: %s', info.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	});
};

