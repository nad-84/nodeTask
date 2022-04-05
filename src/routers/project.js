const express = require("express");
const Project = require("../models/project");
const auth = require("../middleware/auth");
const AppError = require("../Errors/appError");
const User = require("../models/user");
const { auth_admin } = require("../middleware/auth_admin");

const router = new express.Router();

//Create Project
router.post("/projects", auth, async (req, res, next) => {
  const project = new Project({
    ...req.body, //Express Spread Op
    owner: req.user._id,
  });
  try {
    await project.save();
    res.status(201).send("New Project is added");
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
  }
});

//Read the Project
router.get("/projects", auth, async (req, res, next) => {
  const _id = req.user._id;
  try {
    const project = await Project.find({ owner: _id.toString() });
    if (!project) {
      return res.send(404).send("No Project");
    }
    res.send(project);
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
  }
});

//Admin Reading All the Projects
router.get("/admin/projects", auth_admin, async (req, res) => {
  try {
    const project = await Project.find({});
    if (!project) {
      return res.send(404).send("No Project");
    }
    res.send(project);
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
  }
});

//Update Project
router.patch("/projects/:id", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = [
    "title",
    "description",
    "short_description",
    "start_date",
    "end_date",
    "acess_link",
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return next(new AppError({ error: "Invalid updates!" }, 400));
  }
  try {
    const project = await Project.findOne({
      _id: req.params.id,
    });
    if (!project) {
      return next(new AppError("No Project is found!", 404));
    }

    updates.forEach((update) => (project[update] = req.body[update]));
    await project.save();
    res.send("Project is updated");
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 400));
  }
});

//Delete the Project by ID
router.delete("/projects/:id", auth, async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).send();
    }

    res.status(200).send("Project have been removed");
  } catch (e) {
    console.log(e);
    return next(new AppError(e, 500));
  }
});

module.exports = router;
