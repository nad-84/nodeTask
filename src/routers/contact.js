const express = require("express");
const Contact = require("../models/contact");
const auth = require("../middleware/auth");
const router = new express.Router();

//Create Contact
router.post("/contacts", auth, async (req, res) => {
  const contact = new Contact({
    ...req.body, //Express Spread Op
    owner: req.user._id,
  });
  try {
    await contact.save();
    res.status(201).send("About detail is added");
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

//Read the about
router.get("/contacts", auth, async (req, res) => {
  try {
    const contact = await Contact.find({});
    if (!contact) {
      return res.status(404).send("No Project is found");
    }
    res.send(contact);
    res.send(user.name);
  } catch (e) {
    res.status(500).send();
    console.log(e);
  }
});

//Update Contact
router.patch("/contacts/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["phone", "address", "email"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
    });
    if (!contact) {
      return res.status(404).send();
    }

    updates.forEach((update) => (contact[update] = req.body[update]));
    res.send("Contact is update");
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

//Delete the Contact by ID
router.delete("/contacts/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!contact) {
      res.status(404).send();
    }

    res.send("Contact! have been deleted");
  } catch (e) {
    res.status(500).send();
    console.log(e);
  }
});

module.exports = router;
