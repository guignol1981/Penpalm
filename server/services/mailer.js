'use strict';
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: process.env.NODE_ENV === 'prod' ? 'gmail' : null,
    host: process.env.NODE_ENV === 'prod' ? 'smtp.gmail.com' : 'smtp.ethereal.email',
    port:  process.env.NODE_ENV === 'prod' ? 465 : 587,
    secure: process.env.NODE_ENV === 'prod',
    auth: {
        user: process.env.NODE_ENV === 'prod' ? 'info@penpalms.com' : 'xqshdvio7ytxihl4@ethereal.email',
        pass: process.env.MAIL_PASSWORD || 'VavhfQdxWeCbN6HD2n'
    }
});

module.exports.sendMail = function (options) {
    transporter.sendMail(options, (error, info) => {
    });
};
