const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
    });

    if (!user) {
      return next(new AppError());
    }
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return next(new AppError({ error: "Please authenticate." }, 401));
  }
};

module.exports = auth;
