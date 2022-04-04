const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: "www.google.com",
    },
  },
  {
    timestamps: true,
  }
);
const Skill = mongoose.model("skill", skillSchema);

module.exports = Skill;
