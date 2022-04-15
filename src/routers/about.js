const express = require("express");
const About = require("../models/about");
const auth = require("../middleware/auth");
const AppError = require("../Errors/appError");
const { isLogin } = require("../middleware/isLogin");

const router = new express.Router();

//Create About
router.post("/abouts", auth, async (req, res, next) => {
  const about = new About({
    ...req.body, //Express Spread Op
    owner: req.user._id,
  });
  try {
    await about.save();
    res.status(201).json({
      status: "success",
      message: "New About Details is added",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Reqd the about
router.get("/abouts", auth, async (req, res, next) => {
  const _id = req.user._id;
  try {
    const about = await About.find({ owner: _id.toString() });
    if (!about || about.length === 0) {
      return next(new AppError("No! about is found", 404));
    }
    res.status(200).send(about);
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Admin Reading All the Abouts
router.get("/admin/allAbouts", isLogin, async (req, res, next) => {
  if (req.user?.role !== "admin" || !req.user) {
    return next(new AppError("Admin should be login for this task", 401));
  }
  try {
    const about = await About.find({});
    if (!about || about.length === 0) {
      return next(new AppError("No! About is found", 404));
    }
    res.status(200).send(about);
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Update About
router.patch("/abouts/:id", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = [
    "bio",
    "level",
    "degree",
    "institue",
    "percentage",
    "description",
    "start_date",
    "end_date",
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return next(new AppError("Invalid Updates!", 400));
  }
  try {
    const about = await About.findOne({
      _id: req.params.id,
    });

    if (!about || about.length === 0) {
      return next(new AppError("No! About is found", 404));
    }

    updates.forEach((update) => (about[update] = req.body[update]));
    await about.save();
    res.status(200).json({
      status: "success",
      message: "About is updated",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Delete the About by ID
router.delete("/abouts/:id", auth, async (req, res, next) => {
  try {
    const about = await About.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!about || about.length === 0) {
      return next(
        new AppError("No! About is found on that ID or Invalid ID !", 404)
      );
    }
    res.status(200).json({
      status: "success",
      message: "About have Removed",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = router;
