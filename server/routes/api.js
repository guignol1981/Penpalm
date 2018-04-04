let express = require('express');
let router = express.Router();
let passport = require('passport');
let authenticate = require('express-jwt')({
    secret: 'my-secret',
    requestProperty: 'auth'
});

let userController = require('../controllers/user-controller');
let authenticatorController = require('../controllers/authenticator-controller');
let postcardController = require('../controllers/postcard-controller');

router.post('/auth/facebook',
    passport.authenticate('facebook-token'),
    authenticatorController.prepareReqForToken,
    authenticatorController.generateToken,
    authenticatorController.sendToken);

router.post('/auth/google',
    passport.authenticate('google-token'),
    authenticatorController.prepareReqForToken,
    authenticatorController.generateToken,
    authenticatorController.sendToken);

//users
router.get('/users', authenticate, userController.get);
router.put('/users', authenticate, userController.update);

//postcards
router.post('/postcards', authenticate, postcardController.create);
router.get('/postcards/inbox', authenticate, postcardController.inbox);
router.get('/postcards/sent', authenticate, postcardController.sent);


module.exports = router;