const express = require("express");
const About = require("../models/about");
const auth = require("../middleware/auth");
const AppError = require("../Errors/appError");
const User = require("../models/user");
const { auth_admin } = require("../middleware/auth_admin");

const router = new express.Router();

//Create About
router.post("/abouts", auth, async (req, res) => {
  const about = new About({
    ...req.body, //Express Spread Op
    owner: req.user._id,
  });
  try {
    await about.save();
    res.status(201).send("New About is added");
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

//Reqd the about
router.get("/abouts", auth, async (req, res, next) => {
  const _id = req.user._id;
  try {
    const about = await About.find({ owner: _id.toString() });
    if (!about) {
      return res.send(404).send("No about");
    }
    res.send(about);
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
  }
});

//Admin Reading All the Abouts
router.get("/admin/abouts", auth_admin, async (req, res, next) => {
  try {
    const about = await About.find({});
    if (!about) {
      return res.status(404).send("No! About is found");
    }
    res.send(about);
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
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
    return res.status(400).json({ error: "Invalid updates!" });
  }
  try {
    const about = await About.findOne({
      _id: req.params.id,
    });
    if (!about) {
      return res.status(404).send();
    }

    updates.forEach((update) => (about[update] = req.body[update]));
    await about.save();
    res.status(200).send("About is update");
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 400));
  }
});

//Delete the About by ID
router.delete("/abouts/:id", auth, async (req, res) => {
  try {
    const about = await About.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!about) {
      return res.status(404).send();
    }

    res.status(200).send("About have deleted");
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
});

module.exports = router;
