let User = require('../models/user');

module.exports.get = function (req, res) {
    User.findById(req.auth.id)
        .exec()
        .then(user => {
            res.send({
                msg: 'User found',
                data: user
            });
        });
};

module.exports.getRequests = function (req, res) {
    User.findById(req.auth.id)
        .populate('pendingRequests')
        .exec()
        .then((user) => {
           res.send({
               msg: 'Requests found',
               data: user.pendingRequests
           });
        });
};

module.exports.find = function (req, res) {
    let url = require('url');
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
    let mongooseQuery = User.find();

    mongooseQuery.where('_id').ne(req.auth.id);
    console.log(query);
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

            user.save().then(() => {
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
