const jwt = require("jsonwebtoken");
const AppError = require("../Errors/appError");
const User = require("../models/user");

const auth = async (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
    });
    if (!user) {
      return next(new AppError({ error: "Not Found" }, 404));
    }
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return next(new AppError({ error: "Please authenticate." }, 401));
  }
};

module.exports = auth;
