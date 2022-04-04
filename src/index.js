const express = require("express");
require("./db/mongoose");
//require("../config/dev.env");
const userRouter = require("./routers/user");
const workRouter = require("./routers/work");
const skillRouter = require("./routers/skill");
const contactRouter = require("./routers/contact");
const projectRouter = require("./routers/project");
const aboutRouter = require("./routers/about");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(workRouter);
app.use(skillRouter);
app.use(projectRouter);
app.use(aboutRouter);
app.use(contactRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
