const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { isLogin } = require("../middleware/isLogin");
const authController = require("./../middleware/forgetPassword");
const AppError = require("../Errors/appError");
const router = new express.Router();
const bcrypt = require("bcryptjs");

//REST APIs Route for Create single user
router.post("/users", isLogin, async (req, res, next) => {
  if (req.body.role === "admin" && !req.user) {
    return next(new AppError("Admin should be login for this task", 401));
  } else if (
    req.body.role === "admin" &&
    req.user &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("You are not admin", 401));
  }
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    console.log(e);
    return next(new AppError("Email already exist", 400));
  }
});

//Doing User LogIn
router.post("/users/login", async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 2443000),
      httpOnly: true,
    });
    res.send({ token });
  } catch (e) {
    return next(
      new AppError("You have entered an invalid username or password", 400)
    );
  }
});

//LogOut(by removing the cookies)
router.get("/logout", (req, res, next) => {
  res.cookie("jwtoken", "LogOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "LogOut",
  });
});

//Admin Reading All Profile
router.get("/admins/allProfile", isLogin, async (req, res, next) => {
  if (req.user?.role !== "admin" || !req.user) {
    return next(new AppError("Admin should be login for this task", 401));
  }
  try {
    const _id = req.user._id;
    const user = await User.find({ owner: _id.toString() });
    if (!user) {
      return next(new AppError("No Profile founded", 404));
    }
    res.send(user);
  } catch (e) {
    return next(new AppError("Something went wrong", 500));
  }
});

//User reading Profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//Update the User
router.patch("/users/update_me", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "age"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  try {
    if (!isValidOperation) {
      return next(new AppError("Not valid operation", 400));
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const user = await User.findByIdAndUpdate(
      {
        _id: req.user._id.toString(),
      },
      {
        ...req.body,
      }
    );
    await user.save();
    const user2 = await User.findById(req.user._id.toString());
    res.status(200).send(user2);
  } catch (e) {
    console.log(e);
    return next(new AppError("Error found", 400));
  }
});

//Updating the password
router.patch("/users/password", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["password"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  try {
    if (!isValidOperation) {
      return next(new AppError("It is not valid Operation", 400));
    }
  } catch (e) {
    console.log(e);
  }
  const id = req.user._id;
  try {
    const user = await User.findByIdAndUpdate({ _id: id });
    {
      const abc = await bcrypt.compare(req.body.password, user.password);
      if (!abc) {
        user.password = req.body.password;
        await user.save();
        res.status(200).json({
          status: "success",
          message: "Password is update",
        });
      } else return next(new AppError("Can't Use old password", 400));
    }
  } catch (e) {
    console.log(e);
    return next(new AppError(e.message, 400));
  }
});

//Delete the User which is login
router.delete("/users/delete_me", auth, async (req, res, next) => {
  try {
    await req.user.remove();
    deleteEmail(req.user.email, req.user.name);
    res.status(200).json({
      status: "success",
      message: "You are deleted",
    });
  } catch (e) {
    return next(new AppError("Something went wrong", 500));
  }
});

//Deleting user by id
router.delete("/admin/delete/:_id", isLogin, async (req, res, next) => {
  if (req.user.role !== "admin" || !req.user) {
    return next(new AppError("Admin should be login for this task", 401));
  }
  try {
    const user = await User.findByIdAndDelete(req.params._id);
    if (!user) {
      return next(new AppError("No Profile on that ID", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Account is deleted",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Search by name
router.get("/users/:name", auth, async (req, res, next) => {
  const name = req.params.name;

  try {
    const user = await User.findOne({ name: name });

    if (!user) {
      return next(new AppError("No User founded", 404));
    }

    res.status(200).send(user);
  } catch (e) {
    return next(new AppError("Something went wrong", 500));
  }
});

//ForgetPassword
router.put("/forgotPassword", authController.forgotPassword);

//ResetPassword
router.patch("/resetPassword", authController.resetPassword);

module.exports = router;
