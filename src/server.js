require("./db/mongoose");
const express = require("express");
const globalErrorHandler = require("./Errors/appError");

const app = require("./app");

app.use(express.json());

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
app.use(globalErrorHandler);
