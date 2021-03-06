let express = require('express');
let router = express.Router();
let passport = require('passport');
let multer = require('multer');
let upload = multer({storage: multer.memoryStorage()});
let authenticate = require('express-jwt')({
	secret: 'my-secret',
	requestProperty: 'auth'
});

let userController = require('../controllers/user-controller');
let authenticatorController = require('../controllers/authenticator-controller');
let postcardController = require('../controllers/postcard-controller');
let newsController = require('../controllers/news-controller');
let utilController = require('../controllers/util-controller');
let imageController = require('../controllers/image-controller');
let googleMapController = require('../controllers/google-map-controller');

//auth
router.post('/auth/facebook',
	(req, res, next) => {
		passport.authenticate('facebook-token', (err, user) => {
			if (err && err.code === 11000) {
				let msg = 'Something went wrong';

				if (err.code === 11000) {
					msg = 'This email is already used'
				}
				res.status(500).json({msg: msg});
				return;
			}

			req.user = user;
			next();
		})(req, res, next);
	},
	authenticatorController.prepareReqForToken,
	authenticatorController.generateToken,
	authenticatorController.sendToken);

router.post('/auth/google',
	(req, res, next) => {
		passport.authenticate('google-token', (err, user) => {
			if (err && err.code === 11000) {
				let msg = 'Something went wrong';

				if (err.code === 11000) {
					msg = 'This email is already used'
				}
				res.status(500).json({msg: msg});
				return;
			}

			req.user = user;
			next();
		})(req, res, next);
	},
	authenticatorController.prepareReqForToken,
	authenticatorController.generateToken,
	authenticatorController.sendToken);

router.post('/auth/local',
	(req, res, next) => {
		passport.authenticate('local', (err, user) => {
			if (err) {
				res.status(500).json({
					msg: err.message,
					data: false
				});
				return;
			}

			req.user = user;
			next();
		})(req, res, next);
	},
	authenticatorController.prepareReqForToken,
	authenticatorController.generateToken,
	authenticatorController.sendToken);

//users
router.get('/users', authenticate, userController.get);
router.get('/users/pals', authenticate, userController.getPals);
router.get('/users/discover', authenticate, userController.find);
router.get('/users/pending-requests', authenticate, userController.getPendingRequests);
router.get('/users/sent-requests', authenticate, userController.getRequests);
router.put('/users', authenticate, userController.update);
router.put('/users/request', authenticate, userController.request);
router.put('/users/handle-request', authenticate, userController.handleRequest);
router.put('/users/cancel-request', authenticate, userController.cancelRequest);
router.put('/users/remove-pal', authenticate, userController.removePal);
router.post('/users/register', userController.register);
router.put('/users/verify-email/:link', userController.verifyEmail);
router.put('/users/reset-password/:link', userController.resetPassword);
router.put('/users/send-verification-email', userController.sendVerificationEmail);
router.put('/users/send-password-recovery-email', userController.sendPasswordRecoveryEmail);
router.delete('/users', authenticate, userController.remove);

//postcards
router.post('/postcards', authenticate, postcardController.create);
router.put('/postcards/seen', authenticate, postcardController.markSeen);
router.get('/postcards/in', authenticate, postcardController.getInbox);
router.get('/postcards/out', authenticate, postcardController.getOutbox);
router.get('/postcards/total-count', postcardController.getTotalCount)

//news
router.get('/news', authenticate, newsController.fetch);

//utils
router.get('/util/countries', authenticate, utilController.getCountries);
router.get('/util/languages', authenticate, utilController.getLanguages);
router.get('/util/templates', authenticate, utilController.getTemplates);

//images
router.delete('/images/:cloudstorageobject', authenticate, imageController.remove);
router.post('/images', authenticate, upload.single('image'), imageController.sendUploadToGCS, imageController.upload);

//google map
router.put('/geo-data', authenticate, googleMapController.getGeoData);

module.exports = router;