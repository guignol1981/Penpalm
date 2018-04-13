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

module.exports.find = function (req, res) {
    console.log('ok');
    User.find()
        .where('_id')
        .ne(req.auth.id)
        .exec()
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

module.exports.request = function(req, res) {
    User.findById(req.body._id)
        .exec()
        .then((user) => {
            user.pendingRequests.push(req.auth.id);
            user.save().then(() => {
                res.send({
                    msg: 'Pal request done',
                    data: true
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
