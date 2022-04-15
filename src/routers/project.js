const express = require("express");
const Project = require("../models/project");
const auth = require("../middleware/auth");
const AppError = require("../Errors/appError");
const { isLogin } = require("../middleware/isLogin");

const router = new express.Router();

//Create Project
router.post("/projects", auth, async (req, res, next) => {
  const project = new Project({
    ...req.body, //Express Spread Op
    owner: req.user._id,
  });
  try {
    await project.save();
    res.status(201).json({
      status: "success",
      message: "New Project Details is added",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Read the Project
router.get("/projects", auth, async (req, res, next) => {
  const _id = req.user._id;
  try {
    const project = await Project.find({ owner: _id.toString() });
    if (!project || project.length === 0) {
      return next(new AppError("No! Project is found", 404));
    }
    res.status(200).send(project);
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Admin Reading All the Projects
router.get("/admin/allProjects", isLogin, async (req, res, next) => {
  if (req.user?.role !== "admin" || !req.user) {
    return next(new AppError("Admin should be login for this task", 401));
  }
  try {
    const project = await Project.find({});
    if (!project || project.length === 0) {
      return next(new AppError("No Project found", 404));
    }
    res.status(200).send(project);
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
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
    return next(new AppError("Invalid Updates!", 400));
  }
  try {
    const project = await Project.findOne({
      _id: req.params.id,
    });
    if (!project || project.length === 0) {
      return next(new AppError("No! Project is found", 404));
    }

    updates.forEach((update) => (project[update] = req.body[update]));
    await project.save();
    res.status(200).json({
      status: "success",
      message: "Project is updated",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

//Delete the Project by ID
router.delete("/projects/:id", auth, async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project || project.length === 0) {
      return res.status(404).send();
    }
    res.status(200).json({
      status: "success",
      message: "Project have Removed",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = router;
