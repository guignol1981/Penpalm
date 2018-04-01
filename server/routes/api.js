let express = require('express');
let router = express.Router();
let passport = require('passport');
let authenticate = require('express-jwt')({
    secret: 'my-secret',
    requestProperty: 'auth'
});
let jwt = require('jsonwebtoken');

let userController = require('../controllers/user-controller');

let createToken = function (auth) {
    return jwt.sign({
            id: auth.id
        }, 'my-secret',
        {
            expiresIn: 60 * 120
        });
};

let generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    next();
};

let sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    res.status(200).send(req.auth);
};

router.post('/auth/facebook', passport.authenticate('facebook-token'),
    (req, res, next) => {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }

        req.auth = {
            id: req.user.id
        };

        next();
    }, generateToken, sendToken);

router.get('/users', authenticate, userController.get);

module.exports = router;