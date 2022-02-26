const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user/user");
const Astrologer = require("../models/user/astrologer");

  exports.getSignup = (req, res, next) => {
  const fullname = req.body.fullname;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ where: { email: email } }).then((mail) => {
    if (mail) {
        return res.status(409).json({
        message: "Email already exist",
      })
    }
    bcrypt.hash(password, 12, function(err, results){
      if(err){
          throw new Error(err)
       }
       if (results) {
        const SignUpToken = jwt.sign(
          {
            fullname: fullname,
            email: email,
            username: username,
            password:results
          },
          process.env.JWT_SIGN_UP,
          {
            expiresIn: '15m'
          }
        );

          var url = SignUpToken;
            let transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: process.env.SMTP_PORT,
              secure: true, // true for 465, false for other ports
              auth: {
                  user: process.env.SMTP_AUTH_USER, // generated ethereal user
                  pass: process.env.SMTP_AUTH_PASS // generated ethereal password
              },
              tls:{
                rejectUnauthorized:false
              }
            });
            let mailOptions = {
              from: process.env.MAIL_OPTION_FORM, // sender address
              to: email,//process.env.MAIL_OPTION_TO, // list of receivers
              subject: process.env.MAIL_OPTION_SUB, // Subject line
              text: process.env.MAIL_MESSAGE, // plain text body
              html: '<p><b>Hello '+fullname+' </b> Please click on the link below to <b>Verify</b> your account</p>'+process.env.DOMAIN_URL+'/user/email-confirmation/'+url // html body
            };
          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
             console.log('Message sent: %s', info.messageId);   
          });
          var decoded = jwt.decode(SignUpToken);
          return res.status(200).json({ msg: "Please check your email", SignUpToken: decoded})
      } else {
          return res.status(401).json({ msg: "Auth failed"})
      }
     })
  });
  };

  exports.getSignUpConfirmation = (req, res, next) => {
    var toc = req.params.SignUpToken;
    var decoded = jwt.decode(toc);
          fullname= decoded.fullname,
          email= decoded.email,
          username= decoded.username,
          password= decoded.password
      User.findOne({ where: { email: email } } && { where: { username: username } }).then((mail) => {
        if (mail) {
          return res.status(409).json({
            message: "Verification fall, Already exist..."
          })
        }
            User.create({
              fullname: fullname,
              email: email,
              username: username,
              password: password
            })
            return res.status(409).json({ message: "Youe account is verified now.." })
      });
  };  

  exports.getForgetPass = (req, res, next) => {
    const email= req.body.email;
    const password= req.body.password; 
  
    User.findOne({ where: { email: email } } ).then((mail) => {
      if (!mail) {
        return res.status(409).json({
          message: "Email does not exist"
        })
      }
      bcrypt.hash(password, 12, function(err, results){
        if(err){
            throw new Error(err)
         }
  
         if (results) {
          const toconForgetPassRecover = jwt.sign(
            {
              email: email,
              password: results
            },
            process.env.JWT_FORGET_PASSWORD,
            {
              expiresIn: '15m'
            }
          );
  
            var url = toconForgetPassRecover;
              let transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_AUTH_USER, // generated ethereal user
                    pass: process.env.SMTP_AUTH_PASS  // generated ethereal password
                },
                tls:{
                  rejectUnauthorized:false
                }
              });
              let mailOptions = {
                from: process.env.MAIL_OPTION_FORM, // sender address
                to: email,//process.env.MAIL_OPTION_TO, // list of receivers
                subject: process.env.MAIL_OPTION_SUB, // Subject line
                text: process.env.MAIL_MESSAGE, // plain text body
                html: '<p><b>Hello '+fullname+' </b> Please click below</p>'+process.env.DOMAIN_URL+'/user/password-recover/'+url // html body
              };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
               console.log('Message sent: %s', info.messageId);   
            });
            var decoded = jwt.decode(toconForgetPassRecover);
            return res.status(200).json({ msg: "Please check your email"})
        } else {
            return res.status(401).json({ msg: "Auth failed"})
        }
       })
    });
  };
  
  exports.getForgetPassRecover = (req, res, next) => {
    const toconForgetPassRecover = req.params.toconForgetPassRecover;
    const decoded = jwt.decode(toconForgetPassRecover);
          email= decoded.email,
          password= decoded.password,
    User.findOne({ where: { email: email } }).then((user) => {
      if (!user) {
        return res.status(409).json({message: "Invalid Email..."});
      }
      user.update({
       email: email,
       password: password
      })
      return res.status(401).json({ msg: "Your password is changed now.."})
      if(err){ throw new Error(err)} else {
          return  res.status(401).json({ msg: "Auth failed last"})
        }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  };

  exports.getSignin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
         return res.status(409).json({message: "Auth failed"});
        }
        bcrypt.compare(password, user.password, function(err, results){
          if(err){
              throw new Error(err)
           }
           if (results) {
            const tokenSignin = jwt.sign(
              {
                email: user.email,
                userId: user.id
              },
              process.env.JWT_SIGN_IN,
              {
                  expiresIn: "25m"
              }
            );
              return res.status(200).json({ msg: "Login success",data: user, token: tokenSignin})
          } else {
              return res.status(401).json({ msg: "Auth failed"})
          }
         })
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.getUpdateUser = (req, res, next) => {
    const fullname= req.body.fullname;
    const email= req.body.email;
    const username= req.body.username;
    const oldpassword= req.body.oldpassword;
    const password= req.body.password;
    const phone= req.body.phone;
    const dob= req.body.dob;
    const pob=  req.body.pob;
    const cob=  req.body.cob;

    User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
       return res.status(409).json({message: "Auth failed"});
      }
      bcrypt.compare(oldpassword, user.password, function(err, results){
        if(err){throw new Error(err) } 
        if(results){
          bcrypt.hash(password, 12).then((hashPassword) => {
              user.update({
              fullname: fullname,
              username: username,
              password: hashPassword,
              phone: phone,
              dob: dob,
              pob: pob,
              cob: cob
            })
          })
          return  res.status(200).json({ msg: "Update success",data: user})
        } else {
          return  res.status(401).json({ msg: "Auth failed"})
        }
       })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  };

  exports.getSignUpAstrologer = (req, res, next) => {
    const email = req.body.email;
    const abbreviation = req.body.abbreviation;
    const university = req.body.university;
    const los = req.body.los;
    const sector = req.body.sector;

    User.findOne({ where: { email: email } }).then((mail) => {
      if (!mail) {
        return res.status(409).json({
          message: "Verification fall, Please sign up your user account first with this email...."
        })
      }
      const tokenSignUpAstrologer = jwt.sign(
        {
          email:email,
          abbreviation: abbreviation,
          university: university,
          los: los,
          sector:sector
        },
        process.env.JWT_ASTROLOGER_SIGN_UP,
        {
          expiresIn: '15m'
        }
      );
        var url = tokenSignUpAstrologer;
          let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_AUTH_USER, // generated ethereal user
                pass: process.env.SMTP_AUTH_PASS  // generated ethereal password
            },
            tls:{
              rejectUnauthorized:false
            }
          });
          let mailOptions = {
            from: process.env.MAIL_OPTION_FORM, // sender address
            to: email,//process.env.MAIL_OPTION_TO, // list of receivers
            subject: process.env.MAIL_OPTION_SUB, // Subject line
            text: process.env.MAIL_MESSAGE, // plain text body
            html: '<p><b>Hello there, </b>Please click on the link to verify!</p>'+process.env.DOMAIN_URL+'/user/astrologer-confirmation/'+url // html body
          };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
           console.log('Message sent: %s', info.messageId);   
        });
        var decoded = jwt.decode(tokenSignUpAstrologer);
        return res.status(200).json({ msg: "Please check your email", tokenSignUpAstrologer: decoded})  
    })
  };

  exports.getAstrologerSignUpConfirmation = (req, res, next) =>{
    var toc = req.params.tokenSignUpAstrologer;
    var decoded = jwt.decode(toc);

    const email = decoded.email;
    const abbreviation = decoded.abbreviation;
    const university = decoded.university;
    const los = decoded.los;
    const sector = decoded.sector;

  User.findOne({ where: { email: email } }).then((mail) => {
    const userid = mail.id;
    if (!mail) {
      return res.status(409).json({
        message: "Verification fall, Please sign up your user account first with this email...."
      }) 
    }
    Astrologer.findOne({ where: { userid : userid	} }).then((mail) => {
      if (mail) {
          return res.status(409).json({
          message: "Already done",
        })
      }
      Astrologer.create({
        abbreviation: abbreviation,
        university: university,
        los: los,
        sector: sector,
        userId: userid      
      })
      return res.status(409).json({ message:" Youe account Astrloger is verified now.." })
    })
      
  }).catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }next(err);
     });
  };
  
  exports.getUpdateAstrologer = (req, res, next) => {
    const email= req.body.email;
    const abbreviation= req.body.abbreviation;
    const university= req.body.university;
    const los= req.body.los;
    const sector= req.body.sector;

    User.findOne({ where: { email: email } }).then((mail) => {
      if (!mail) {
        return res.status(409).json({ message: "Email id does not exist..."}) 
      }
      const userid = mail.id;
      Astrologer.findOne({ where: { userid : userid	} }).then((Astrologer) => {
        if (!Astrologer) {
            return res.status(409).json({
            message: "Astrologer not exist.."
          })
        }
        Astrologer.update({
          abbreviation: abbreviation,
          university: university,
          los: los,
          sector: sector    
        })
        return res.status(409).json({ message:" Youe account Astrloger Update success.." })
      })
    }).catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }next(err);
       }); 
  };
