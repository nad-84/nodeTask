const express = require("express");
const Work = require("../models/work");
const auth = require("../middleware/auth");
const AppError = require("../Errors/appError");
const { isLogin } = require("../middleware/isLogin");

const router = new express.Router();

//Create Work
router.post("/works", auth, async (req, res, next) => {
  const work = new Work({
    ...req.body, //Express Spread Op
    owner: req.user._id,
  });
  try {
    await work.save();
    res.status(201).json({
      status: "success",
      message: "New Work Details is added",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Read the work
router.get("/works", auth, async (req, res, next) => {
  const _id = req.user._id;
  try {
    const work = await Work.find({ owner: _id.toString() });
    if (!work || work.length === 0) {
      return next(new AppError("No Work found", 404));
    }
    res.status(200).send(work);
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Admin Reading All the Works
router.get("/admin/allWorks", isLogin, async (req, res, next) => {
  if (req.user?.role !== "admin" || !req.user) {
    return next(new AppError("Admin should be login for this task", 401));
  }
  try {
    const work = await Work.find({});
    if (!work || work.length === 0) {
      return next(new AppError("No! Work is found", 404));
    }
    res.status(200).send(work);
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Update Work
router.patch("/works/:id", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["company", "description", "start_date", "end_date"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return next(new AppError({ error: "Invalid Updates!" }, 404));
  }
  try {
    const work = await Work.findOneAndUpdate({
      _id: req.params.id,
    });

    if (!work || work.length === 0) {
      return next(new AppError("No! Work found", 404));
    }

    updates.forEach((update) => (work[update] = req.body[update]));
    await work.save();
    res.status(200).json({
      status: "success",
      message: "Work is updated",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Delete the Work by ID
router.delete("/works/:id", auth, async (req, res, next) => {
  try {
    const work = await Work.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!work || work.length === 0) {
      new AppError("No! Work is found on that ID or Invalid ID !", 404);
    }

    res.status(200).send("Work hvae benn Deleted");
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = router;
