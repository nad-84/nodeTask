const express = require("express");
const Skill = require("../models/skill");
const auth = require("../middleware/auth");
const AppError = require("../Errors/appError");
const { isLogin } = require("../middleware/isLogin");

const router = new express.Router();

//Create Skill
router.post("/skills", auth, async (req, res, next) => {
  const skill = new Skill({
    ...req.body, //Express Spread Op
    owner: req.user._id,
  });
  try {
    await skill.save();
    res.status(201).json({
      status: "success",
      message: "Created successfully",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Read the Skill
router.get("/skills", auth, async (req, res, next) => {
  const _id = req.user._id;
  try {
    const skill = await Skill.find({ owner: _id.toString() });
    if (!skill || skill.length === 0) {
      return next(new AppError("No! Skill is found", 404));
    }
    res.status(200).send(skill);
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Admin Reading All the Skiils
router.get("/admin/allSkills", isLogin, async (req, res, next) => {
  if (req.user?.role !== "admin" || !req.user) {
    return next(new AppError("Admin should be login for this task", 401));
  }
  try {
    const skill = await Skill.find({});
    if (!skill) {
      return next(new AppError("No! Skill is found", 404));
    }
    res.status(200).send(skill);
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Update Skill
router.patch("/skills/:id", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "link"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const skill = await Skill.findOne({
      _id: req.params.id,
    });
    if (!skill || skill.length === 0) {
      return next(new AppError("No! Skill is found", 404));
    }

    updates.forEach((update) => (skill[update] = req.body[update]));
    await skill.save();
    res.status(200).json({
      status: "success",
      message: "Skill is updated",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Delete the Skill by ID
router.delete("/skills/:id", auth, async (req, res, next) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!skill || skill.length === 0) {
      return res.status(404).send();
    }
    res.status(200).json({
      status: "success",
      message: "Skill have Removed",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = router;
