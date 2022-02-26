const jwt = require('jsonwebtoken');
const User = require("../models/user/user");

exports.signUpVirify = (req, res, next) => {
    try {
        jwt.verify(req.params.SignUpToken, process.env.JWT_SIGN_UP);
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed, your verification link is expired please signup again...'
        });
    }
};
exports.forgetPasswordVerify = (req, res, next) => {
    try {
        jwt.verify(req.params.toconForgetPassRecover, process.env.JWT_FORGET_PASSWORD);
        next();
    } catch (error) {
        return res.status(404).json({
            message: 'Auth failed...',
        });
    }
};
exports.signinVerify = (req, res, next) => {
    try {
        const tokenSignin = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(tokenSignin, process.env.JWT_SIGN_IN);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};
exports.AstrologerSignUpVerify = (req, res, next) => {
    try {
        jwt.verify(req.params.tokenSignUpAstrologer, process.env.JWT_ASTROLOGER_SIGN_UP);
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Your verification email is expired, Please request for new one...',
        });
    } 
}
exports.passwordMatch = (req, res, next) => {
    const password= req.body.password;
    const passwordagain= req.body.passwordagain
    if(password !== passwordagain){return res.status(409).json({ msg: "Password does not match"})}
    else(next())      
};
exports.usernameMatch = (req, res, next) => {
    const username = req.body.username;
    User.findOne({ where: { username: username } }).then((mail) => {
        if (mail) {
            return res.status(409).json({
            message: "Username already exist..."
          })
        } else(next())
         
    });
};
exports.phoneMatch = (req, res, next) => {
    const phone = req.body.phone;
    User.findOne({ where: { phone: phone } }).then((mail) => {
        if (mail) {
            return res.status(409).json({
            message: "This number is already in used...",
          })
        } else(next())
    });
};
exports.validateEmail = (req, res, next) => {
    const email= req.body.email;
filter = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
if (filter.test(email)){next()}
else{return res.status(409).json({ msg: "email is not valid"})}
};
exports.validatePassword = (req, res, next) => {
    const password= req.body.password;
filter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
if (filter.test(password)){next()}
else{return res.status(409).json({ msg: "Your password should contain minimum eight characters, at least one letter, one number and one special character..."})}
};
exports.validateUsername = (req, res, next) => {
    const username= req.body.username;
filter = /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
if (filter.test(username)){next()}
else{return res.status(409).json({ msg: "Failed: Username can only use letters,numbers, minimum length is 6 characters"})}
};
exports.validatePhoneNumber = (req, res, next) => {
    const phone= req.body.phone;
filter = /\d{3}-\d{3}-\d{4}/;
if (filter.test(phone)){next()}
else{return res.status(409).json({ msg: "Failed: Please enter valid phone number"})}
};