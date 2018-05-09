let User = require('../models/user');
let url = require('url');
let mailer = require('../services/mailer');
let EmailVerificationLink = require('../models/email-verification-link');
let ResetPasswordLink = require('../models/reset-password-link');

module.exports.register = function (req, res) {
    if (!req.body['username'] || !req.body['email'] || !req.body['password']) {
        res.status(400).json({
            msg: 'All fields required',
            data: false
        });

        return;
    }

    let user = new User();

    user.name = req.body['username'];
    user.email = req.body['email'];
    user.setPassword(req.body['password']);

    user.save(function (err) {
        if (err) {
            if (err.code === 11000) {
                res.status(500).json({msg: 'this email is already used'});
            }
            return;
        }

        let emailVerificationLink = new EmailVerificationLink();
        emailVerificationLink.user = user;
        emailVerificationLink.generateLink();
        emailVerificationLink.save().then((emailVerificationLink) => {

            res.render('confirm-email', {
                data: {
                    id: emailVerificationLink.link
                    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
                },
            }, (err, html) => {
                mailer.sendMail({
                    from: '"Penpalm" <info@penpalm.com>',
                    to: user.email,
                    subject: 'Confirm your email',
                    text: 'Hello ' + user.name + '! Please click the link to confirm email address.',
                    html: html
                });
            });

            res.status(200).json({
                msg: 'User created',
                data: true
            });

        });
    });
};

module.exports.verifyEmail = function (req, res) {
    let link = req.params.link;

    EmailVerificationLink.findOne({
        link: link
    })
        .exec()
        .then((link) => {
            if (link) {
                link.remove();
                User.findById(link.user)
                    .exec()
                    .then((user) => {
                        user.emailVerified = true;
                        user.save().then(() => {
                            res.send({
                                msg: 'account activated',
                                data: true
                            });
                        });
                    });
            } else {
                res.status(400).json({
                    msg: 'Link not found',
                    data: false
                });
            }
        });
};

module.exports.resetPassword = function (req, res) {
    let link = req.params.link;
    let password = req.body.password;

    ResetPasswordLink.findOne({
        link: link
    })
        .exec()
        .then((link) => {
            if (link) {
                link.remove();
                User.findById(link.user)
                    .exec()
                    .then((user) => {
                        user.setPassword(password);
                        user.save().then(() => {
                            res.send({
                                msg: 'Password updated!',
                                data: true
                            });
                        });
                    });
            } else {
                res.status(400).json({
                    msg: 'Link not found',
                    data: false
                });
            }
        });
};

module.exports.sendVerificationEmail = function (req, res) {
    let email = req.body.email;

    User.findOne({email: email})
        .exec()
        .then(user => {
            if (!user) {
                res.send({
                    msg: 'No user with this email address',
                    data: false
                });

                return;
            }

            let emailVerificationLink = new EmailVerificationLink();
            emailVerificationLink.generateLink();
            emailVerificationLink.user = user;

            emailVerificationLink.save().then(emailVerificationLink => {

                res.render('confirm-email', {
                    data: {
                        id: emailVerificationLink.link,
						baseUrl: process.env.BASE_URL || 'http://localhost:3000'
                    },
                }, (err, html) => {
                    mailer.sendMail({
                        from: '"Penpalm" <info@penpalm.com>',
                        to: user.email,
                        subject: 'Confirm your email',
                        text: 'Hello ' + user.name + '! Please click the link to confirm email address.',
                        html: html
                    });

                    res.send({
                        msg: 'Link sent to email address',
                        data: true
                    });
                });
            });
        });
};

module.exports.sendPasswordRecoveryEmail = function (req, res) {
    let email = req.body.email;

    User.findOne({email: email})
        .exec()
        .then(user => {
            if (!user) {
                return;
            }

            let resetPasswordLink = new ResetPasswordLink();
            resetPasswordLink.generateLink();
            resetPasswordLink.user = user;

            resetPasswordLink.save().then(resetPasswordLink => {

                res.render('reset-password-email', {
                    data: {
                        id: resetPasswordLink.link,
                        baseUrl: process.env.BASE_URL || 'http://localhost:3000'
                    },
                }, (err, html) => {
                    mailer.sendMail({
                        from: '"Penpalm" <info@penpalm.com>',
                        to: user.email,
                        subject: 'Recover your password',
                        text: 'Hello ' + user.name + '! Please click the link to recover your password.',
                        html: html
                    });
                });
            });
        });

    res.send({
        msg: 'Link sent to email address',
        data: true
    });
};

module.exports.get = function (req, res) {
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
    let id = query.id;

    User.findById(id || req.auth.id)
        .exec()
        .then(user => {
            res.send({
                msg: 'User found',
                data: user
            });
        });
};

module.exports.getPendingRequests = function (req, res) {
    User.findById(req.auth.id)
        .populate('pendingRequests')
        .exec()
        .then((user) => {
            res.send({
                msg: 'Pending requests found',
                data: user.pendingRequests
            });
        });
};

module.exports.getRequests = function (req, res) {
    User.find({'pendingRequests': req.auth.id})
        .exec()
        .then((users) => {
            res.send({
                msg: 'Requests found',
                data: users
            });
        });
};

module.exports.handleRequest = function (req, res) {
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
    let accept = query.accept;

    User.findById(req.auth.id)
        .exec()
        .then((sourceUser) => {
            User.findById(req.body._id)
                .exec()
                .then((targetUser) => {
                    sourceUser.removePendingRequest(targetUser._id, (sourceUser) => {
                        targetUser.removePendingRequest(sourceUser._id, (targetUser) => {
                            if (accept) {
                                sourceUser.pals.push(targetUser._id);
                                targetUser.pals.push(sourceUser._id);

                                res.send({
                                    msg: 'Request accepted',
                                    data: {
                                        targetUser: targetUser,
                                        sourceUser: sourceUser
                                    }
                                });

                            } else {
                                res.send({
                                    msg: 'Request rejected',
                                    data: null
                                });
                            }

                            sourceUser.save();
                            targetUser.save();
                        });
                    });
                });
        });
};

module.exports.removePal = function (req, res) {
    User.findById(req.auth.id)
        .exec()
        .then((sourceUser) => {
            sourceUser.unmatch(req.body._id, (sourceUser) => {
                User.findById(req.body._id)
                    .exec()
                    .then((targetUser) => {
                        targetUser.unmatch(sourceUser._id, (targetUser) => {
                            res.send({
                                msg: 'Removed from pal',
                                data: {
                                    targetUser: targetUser,
                                    sourceUser: sourceUser
                                }
                            });
                        });
                    });
            });
        });
};

module.exports.getPals = function (req, res) {
    User.findById(req.auth.id)
        .populate('pals')
        .exec()
        .then((user) => {
            res.send({
                msg: 'Pals found',
                data: user.pals
            });
            return;
        });
};

module.exports.find = function (req, res) {
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
    let mongooseQuery = User.find();

    mongooseQuery.where('_id').ne(req.auth.id);
    mongooseQuery.where('pals').ne(req.auth.id);
    mongooseQuery.where('pendingRequests').ne(req.auth.id);

    if (query.language !== 'none') {
        mongooseQuery.where('language').eq(query.language);
    }

    if (query.country !== 'none') {
        mongooseQuery.where('country').eq(query.country);
    }

    mongooseQuery.exec()
        .then(users => {
            res.send({
                msg: 'Users found',
                data: users
            });
        });
};

module.exports.update = function (req, res) {
    User.findById(req.auth.id)
        .exec()
        .then(user => {
            let body = req.body;

            user.name = body['name'];
            user.photoData = body['photoData'] || {cloudStorageObject: null, cloudStoragePublicUrl: null};
            user.language = body['language'];
            user.country = body['country'];
            user.description = body['description'];
            user.enableEmailNotifications = body['enableEmailNotifications'];

            user.save().then((user) => {
                res.send({
                    msg: 'User updated',
                    data: user
                });
            });
        });
};

module.exports.request = function (req, res) {
    User.findById(req.body._id)
        .exec()
        .then((user) => {
            user.pendingRequests.push(req.auth.id);
            user.save().then((user) => {
                res.send({
                    msg: 'Pal request done',
                    data: user
                });
            });
        });
};

module.exports.cancelRequest = function (req, res) {
    User.findById(req.body._id)
        .exec()
        .then((user) => {
            let index = user.pendingRequests.indexOf(req.auth.id);
            if (index > -1) {
                user.pendingRequests.splice(index, 1);
            }

            user.save().then((user) => {
                res.send({
                    msg: 'Pal request canceled',
                    data: user
                });
            });
        });
};

module.exports.remove = function (req, res) {
    User.findById(req.auth.id)
        .exec()
        .then(user => {
            user.remove().then(() => {
                res.send({
                    msg: 'account deleted',
                    data: null
                });
            });
        });
};
