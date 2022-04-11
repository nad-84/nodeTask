const AppError = require("../Errors/appError");
const User = require("./../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const { result } = require("lodash");

exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return next(
        new AppError({ error: "User with this email does mot  exists." }, 404)
      );
    }

    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "20m",
    });

    user.updateOne({ resetLink: token }, function (err, success) {
      if (err) {
        return next(new AppError({ error: "Reset password link error." }, 400));
      } else {
        let transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "1fcd4bd70a5fd6", // generated ethereal user
            pass: "8ae8bff0b9db3e", // generated ethereal password
          },
        });
        transporter.sendMail(
          {
            from: "razaranaali066@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Reset Password ✔", // Subject line
            html: `
          <h2>Please click on given link to reset your password</h2>
          <p>${process.env.CLIENT_URL}/resetPassword / Your Link is: ${token}</p>
          `,
          },
          (error, info) => {
            if (error) {
              console.log(error);
              return next(new AppError({ error: "Failed to deliver" }, 400));
            }
            res.status(200).json({
              message: "Email has been sended",
            });
          }
        );
      }
    });
  });
};

exports.resetPassword = (req, res, next) => {
  const { resetLink, newPass } = req.body;
  if (resetLink) {
    jwt.verify(
      resetLink,
      process.env.RESET_PASSWORD_KEY,
      function (error, decodeData) {
        if (error) {
          return next(new AppError("Incorrect Token or it is expired", 400));
        }
        User.findOne({ resetLink }, (err, user) => {
          if (err || !user) {
            return next(
              new AppError("User with this token does not exist.", 404)
            );
          }
          const obj = {
            password: newPass,
          };
          user = _.extend(user, obj);
          user.password = req.body.newPass;
          user.save((err, result) => {
            if (err) {
              console.log(err);
              return next(new AppError("Reset password link error.", 401));
            } else {
              return res.status(200).json({
                message: "Your Password has changed",
              });
            }
          });
        });
      }
    );
  } else {
    console.log(error);
    return next(new AppError({ error: "Authenticaion Error!" }, 401));
  }
};
