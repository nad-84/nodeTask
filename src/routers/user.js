const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { auth_admin } = require("../middleware/auth_admin");
const { sendWelcomeEmail, sendCancelEmail } = require("../api/email");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");

//REST APIs Route for Create single user
router.post("/users", auth_admin, async (req, res) => {
  try {
    const user = new User(req.body);
    sendWelcomeEmail(user.email, "user");
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

//Doing User LogIn
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 2443000),
      httpOnly: true,
    });
    res.send({ token });
  } catch (e) {
    res.status(400).send({
      error: { message: "You have entered an invalid username or password" },
    });
    console.log(e);
  }
});

//LogOut(by removing the item from given array)
router.get("/logout", (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
});

//Reading his/her login account
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//Admin Reading all users
router.get("/admins", async (req, res) => {
  try {
    const admin = await User.find();
    if (!admin) {
      return res.status(404).send("No User found");
    }
    res.send(admin);
  } catch (e) {
    res.status(500).send("Check the Console");
    console.log(e);
  }
});

//Update the User
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Delete the User by ID
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

//upload image
router.post(
  "/users/me/image",
  auth,
  upload.single("image"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//Delete an image
router.delete("/users/me/image", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/image", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

//Search by name
router.get("/users/:name", auth, async (req, res) => {
  const name = req.params.name;

  try {
    const user = await User.findOne({ name: name });

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});
module.exports = router;
