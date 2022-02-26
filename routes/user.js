const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const middleware = require('../middleware/check-auth');

///          router,                  middleware,                                              controller
router.post('/signup',middleware.validateEmail, middleware.validatePassword, middleware.passwordMatch, middleware.validateUsername, middleware.usernameMatch, userController.getSignup);
router.get('/email-confirmation/:SignUpToken', middleware.signUpVirify, userController.getSignUpConfirmation);
router.post('/forgetpass', middleware.validatePassword, middleware.passwordMatch, userController.getForgetPass);
router.get('/password-recover/:toconForgetPassRecover', middleware.forgetPasswordVerify, userController.getForgetPassRecover);
router.post('/signin', userController.getSignin);

router.post('/update', middleware.signinVerify, middleware.usernameMatch, middleware.passwordMatch, middleware.phoneMatch, userController.getUpdateUser);

router.post('/astrologer', middleware.signinVerify, userController.getSignUpAstrologer);
router.get('/astrologer-confirmation/:tokenSignUpAstrologer', middleware.AstrologerSignUpVerify,  userController.getAstrologerSignUpConfirmation);
router.post('/update-astrologer', middleware.signinVerify, userController.getUpdateAstrologer);
module.exports = router;
