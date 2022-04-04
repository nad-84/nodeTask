const express = require("express");
const About = require("../models/about");
const auth = require("../middleware/auth");
const router = new express.Router();

//Create About
router.post("/abouts", auth, async (req, res) => {
  const about = new About({
    ...req.body, //Express Spread Op
    owner: req.user._id,
  });
  try {
    await about.save();
    res.status(201).send("New Project is added");
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

//Reqd the about
router.get("/abouts", auth, async (req, res) => {
  try {
    const about = await About.find({});
    if (!about) {
      return res.status(404).send("No Project is found");
    }
    res.send(about);
    res.send(user.name);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
});

//Update About
router.patch("/abouts/:id", auth, async (req, res) => {
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
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const about = await About.findOne({
      _id: req.params.id,
    });
    if (!about) {
      return res.status(404).send();
    }

    updates.forEach((update) => (about[update] = req.body[update]));
    res.send("About is update");
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
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
      res.status(404).send();
    }

    res.send("About have deleted");
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
});

module.exports = router;
