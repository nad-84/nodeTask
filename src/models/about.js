const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    bio: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    institue: {
      type: String,
    },
    percentage: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    start_date: {
      type: String,
      trim: true,
      required: true,
    },
    end_date: {
      type: String,
      default: "Continue",
    },
  },
  {
    timestamps: true,
  }
);
const About = mongoose.model("about", aboutSchema);

module.exports = About;
