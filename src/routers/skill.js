const express = require("express");
const Skill = require("../models/skill");
const auth = require("../middleware/auth");
const AppError = require("../Errors/appError");
const User = require("../models/user");
const { auth_admin } = require("../middleware/auth_admin");

const router = new express.Router();

//Create Skill
router.post("/skills", auth, async (req, res) => {
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
    res.status(400).send(e);
    console.log(e);
  }
});

//Read the Skill
router.get("/skills", auth, async (req, res, next) => {
  const _id = req.user._id;
  try {
    const skill = await Skill.find({ owner: _id.toString() });
    if (!skill) {
      return res.send(404).send("No Skill");
    }
    res.send(skill);
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
  }
});

//Admin Reading All the Skiils
router.get("/admin/skills", auth_admin, async (req, res, next) => {
  try {
    const skill = await Skill.find({});
    if (!skill) {
      return res.status(404).send("No! Skill is found");
    }
    res.send(skill);
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
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
    if (!skill) {
      return res.status(404).send();
    }

    updates.forEach((update) => (skill[update] = req.body[update]));
    await skill.save();
    res.send("Skill is update");
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 400));
  }
});

//Delete the Skill by ID
router.delete("/skills/:id", auth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!skill) {
      return res.status(404).send();
    }

    res.status(200).send("Skill have been Deleted");
  } catch (e) {
    res.status(500).send();
    console.log(e);
  }
});

module.exports = router;
