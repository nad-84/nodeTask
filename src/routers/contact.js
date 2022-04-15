const express = require("express");
const Contact = require("../models/contact");
const auth = require("../middleware/auth");
const AppError = require("../Errors/appError");
const { isLogin } = require("../middleware/isLogin");

const router = new express.Router();

//Create Contact
router.post("/contacts", auth, async (req, res, next) => {
  const contact = new Contact({
    ...req.body, //Express Spread Op
    owner: req.user._id,
  });
  try {
    await contact.save();
    res.status(201).json({
      status: "success",
      message: "Contact Detail is added",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Read the Contact
router.get("/contacts", auth, async (req, res, next) => {
  const _id = req.user._id;
  try {
    const contact = await Contact.find({ owner: _id.toString() });
    if (!contact || contact.length === 0) {
      return next(new AppError("No Contact!", 404));
    }
    res.send(contact);
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Admin Reading All the Contacts
router.get("/admin/allContacts", isLogin, async (req, res, next) => {
  if (req.user?.role !== "admin" || !req.user) {
    return next(new AppError("Admin should be login for this task", 401));
  }
  try {
    const contact = await Contact.find({});
    if (!contact || contact.length === 0) {
      return next(new AppError("No! Contact is found", 404));
    }
    res.status(200).send(contact);
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
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
    return next(new AppError("Invalid Updates!", 400));
  }
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
    });
    if (!contact || contact.length === 0) {
      return next(new AppError("No! Contact is found", 404));
    }

    updates.forEach((update) => (contact[update] = req.body[update]));
    await contact.save();
    res.status(200).json({
      status: "success",
      message: "About is updated",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Delete the Contact by ID
router.delete("/contacts/:id", auth, async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!contact || contact.length === 0) {
      return next(
        new AppError("No! Contact is found on that ID or Invalid ID !", 404)
      );
    }
    res.status(200).json({
      status: "success",
      message: "Contact! have been deleted",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = router;
