'use strict';
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
	// host: process.env.NODE_ENV === 'prod' ? 'smtp.gmail.com ' : 'smtp.ethereal.email',
	// port: process.env.NODE_ENV === 'prod' ? 465 : 587,
	// secure: process.env.NODE_ENV === 'prod',
	// auth: {
	// 	user: process.env.NODE_ENV === 'prod' ? 'admin@penpalms.com' : 'xqshdvio7ytxihl4@ethereal.email',
	// 	pass: process.env.NODE_ENV === 'prod' ? 'Rudolphe1' : 'VavhfQdxWeCbN6HD2n'
	// }
	service: 'gmail',
	host: 'smtp.gmail.com ',
	port: 465,
	secure: true,
	auth: {
		user: 'info@penpalms.com',
		pass: 'Rudolphe1'
	}
});

module.exports.sendMail = function(options) {
	transporter.sendMail(options, (error, info) => {
	});
};

