let User = require('../models/user');

module.exports.get = function (req, res) {
    User.findById(req.auth.id)
        .populate('penPal')
        .populate('news')
        .exec()
        .then(user => {
            res.send({
                msg: 'User found',
                data: user
            });
        })
};