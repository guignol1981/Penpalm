let User = require('../models/user');

module.exports.get = function(req, res) {
    console.log(req.auth);
    User.findById(req.auth.id).exec().then(user => {
        res.send({
            msg: 'User found',
            data: user
        });
    })
};