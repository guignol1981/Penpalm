let jwt = require('jsonwebtoken');


let createToken = function (auth) {
    return jwt.sign({
            id: auth.id
        }, 'my-secret',
        {
            expiresIn: 60 * 120
        });
};

module.exports.generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    next();
};

module.exports.sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    res.status(200).send(req.auth);
};

module.exports.prepareReqForToken = function(req, res, next) {
    if (!req.user) {
        return res.send(401, 'User Not Authenticated');
    }

    req.auth = {
        id: req.user.id
    };

    next();
};