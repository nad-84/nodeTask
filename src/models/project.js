const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      default: "Continue",
    },
    acess_link: {
      type: String,
      default: "www.google.com",
    },
  },
  {
    timestamps: true,
  }
);
const Project = mongoose.model("project", projectSchema);

module.exports = Project;
