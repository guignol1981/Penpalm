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
let newsController = require('../controllers/news-controller');

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
router.get('/users/find', authenticate, userController.find);
router.get('/users/pending-requests', authenticate, userController.getPendingRequests);
router.get('/users/requests', authenticate, userController.getRequests);
router.put('/users', authenticate, userController.update);
router.put('/users/request', authenticate, userController.request);
router.put('/users/cancel-request', authenticate, userController.cancelRequest);
router.delete('/users', authenticate, userController.remove);

//postcards
router.post('/postcards', authenticate, postcardController.create);
router.put('/postcards/seen', authenticate, postcardController.markSeen);
router.get('/postcards/in', authenticate, postcardController.getInbox);
router.get('/postcards/out', authenticate, postcardController.getOutbox);

//news
router.get('/news', authenticate, newsController.fetch);

module.exports = router;