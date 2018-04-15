let User = require('../models/user');
let url = require('url');

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

            user.language = body['language'];
            user.country = body['country'];
            user.description = body['description'];
            user.showPicture = body['showPicture'];
            user.showName = body['showName'];
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
