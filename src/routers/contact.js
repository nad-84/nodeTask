const express = require("express");
const Contact = require("../models/contact");
const auth = require("../middleware/auth");
const AppError = require("../Errors/appError");
const User = require("../models/user");
const { auth_admin } = require("../middleware/auth_admin");

const router = new express.Router();

//Create Contact
router.post("/contacts", auth, async (req, res) => {
  const contact = new Contact({
    ...req.body, //Express Spread Op
    owner: req.user._id,
  });
  try {
    await contact.save();
    res.status(201).send("Contact detail is added");
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

//Read the Contact
router.get("/contacts", auth, async (req, res, next) => {
  const _id = req.user._id;
  try {
    const contact = await Contact.find({ owner: _id.toString() });
    if (!contact) {
      return res.send(404).send("No Contact");
    }
    res.send(contact);
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
  }
});

//Admin Reading All the Contacts
router.get("/admin/contacts", auth_admin, async (req, res, next) => {
  try {
    const contact = await Contact.find({});
    if (!contact) {
      return res.status(404).send("No! Contact is found");
    }
    res.send(contact);
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
  }
});

//Update Contact
router.patch("/contacts/:id", auth, async (req, res, next) => {
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
    await contact.save();
    res.send("Contact is update");
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 400));
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
      return res.status(404).send();
    }

    res.status(200).send("Contact! have been deleted");
  } catch (e) {
    res.status(500).send();
    console.log(e);
  }
});

module.exports = router;
