const express = require("express");
//require("../config/dev.env");
const userRouter = require("./routers/user");
const workRouter = require("./routers/work");
const skillRouter = require("./routers/skill");
const contactRouter = require("./routers/contact");
const projectRouter = require("./routers/project");
const aboutRouter = require("./routers/about");

const app = express();

app.use(express.json());
app.use(aboutRouter);
app.use(contactRouter);
app.use(projectRouter);
app.use(skillRouter);
app.use(workRouter);
app.use(userRouter);

module.exports = app;
