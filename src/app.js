const express = require("express");
const userRouter = require("./routers/user");
const workRouter = require("./routers/work");
const skillRouter = require("./routers/skill");
const contactRouter = require("./routers/contact");
const projectRouter = require("./routers/project");
const aboutRouter = require("./routers/about");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./middleware/errorHandle");

const app = express();
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(aboutRouter);
app.use(contactRouter);
app.use(projectRouter);
app.use(skillRouter);
app.use(workRouter);
app.use(userRouter);

app.use("*", (req, res) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
