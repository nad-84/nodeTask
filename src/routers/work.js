const express = require("express");
const Work = require("../models/work");
const auth = require("../middleware/auth");
const AppError = require("../Errors/appError");
const User = require("../models/user");
const { auth_admin } = require("../middleware/auth_admin");

const router = new express.Router();

//Create Work
router.post("/works", auth, async (req, res) => {
  const work = new Work({
    ...req.body, //Express Spread Op
    owner: req.user._id,
  });
  try {
    await work.save();
    res.status(201).send("New Work Created");
  } catch (e) {
    res.status(400).send();
    console.log(e);
  }
});

//Read the work
router.get("/works", auth, async (req, res, next) => {
  const _id = req.user._id;
  try {
    const work = await Work.find({ owner: _id.toString() });
    if (!work) {
      return res.send(404).send("No Work");
    }
    res.send(work);
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
  }
});

//Admin Reading All the Works
router.get("/admin/works", auth_admin, async (req, res) => {
  try {
    const work = await Work.find({});
    if (!work) {
      return res.status(404).send("No! Work is found");
    }
    res.send(work);
  } catch (e) {
    res.status(500).send();
    console.log(e);
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
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const work = await Work.findOneAndUpdate({
      _id: req.params.id,
    });

    if (!work) {
      return res.status(404).send();
    }

    updates.forEach((update) => (work[update] = req.body[update]));
    await work.save();
    res.send("Work is update");
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 400));
  }
});

//Delete the Work by ID
router.delete("/works/:id", auth, async (req, res) => {
  try {
    const work = await Work.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!work) {
      return res.status(404).send();
    }

    res.status(200).send("Work hvae benn Deleted");
  } catch (e) {
    res.status(500).send();
    console.log(e);
  }
});

module.exports = router;
