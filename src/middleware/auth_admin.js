const jwt = require("jsonwebtoken");
const AppError = require("../Errors/appError");
const User = require("../models/user");

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
};

exports.auth_admin = async (req, res, next) => {
  // Getting token and check of it's there
  try {
    let token;
    let decoded;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.header("Authorization").replace("Bearer ", "");
      decoded = await jwt.verify(token, process.env.JWT_SECRET);
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token || !decoded) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 404)
      );
    }

    // Check if user still exists
    const currentUser = await User.find({ _id: decoded._id });
    if (currentUser) {
      if (currentUser.role !== "admin" && currentUser.isLogIn == false) {
        return res.status(404).send("The user  is not admin or not logged in.");
      }
    } else {
      return res
        .status(404)
        .send("The user belonging to this token does no longer exist.");
    }
    next();
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
  }
};
