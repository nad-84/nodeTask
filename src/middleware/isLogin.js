const AppError = require("../Errors/appError");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
exports.isLogin = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwtoken) {
      token = req.cookies.jwtoken;
    }
    if (!token) {
      req.user = null;
      return next();
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
    });
    if (!user) {
      req.user = null;
      return next();
    }
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    req.user = null;
    return next(new AppError({error: "Something went wrong"}, 401));
    //next();
  }
};
