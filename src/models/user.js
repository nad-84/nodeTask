const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Work = require("./work");
const Project = require("./project");
const Contact = require("./contact");
const Skill = require("./skill");
const About = require("./about");
const crypto = require("crypto-js");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    isLogIn: {
      type: Boolean,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
      //validate: [validator.isEmail, "Please provide a valid email"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (
          !value.match(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$"
          )
        ) {
          throw new Error(
            "Password should contain 1 uppercase, 1 lowercase , 1 digit"
          );
        }
      },
    },
    resetLink: {
      data: String,
      default: "",
    },

    age: {
      type: Number,
      default: 1,
      validate(value) {
        if (value <= 0) {
          throw new Error("Age must be a postive number");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("works", {
  ref: "work",
  localField: "_id",
  foreignField: "owner",
});
userSchema.virtual("skills", {
  ref: "skill",
  localField: "_id",
  foreignField: "owner",
});
userSchema.virtual("projects", {
  ref: "project",
  localField: "_id",
  foreignField: "owner",
});
userSchema.virtual("contacts", {
  ref: "contact",
  localField: "_id",
  foreignField: "owner",
});
userSchema.virtual("abouts", {
  ref: "about",
  localField: "_id",
  foreignField: "owner",
});

userSchema.index({ email: 1 });
//Hiding Private Data
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

//Function for authentication of LogIn
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: { isLogIn: true },
    }
  );

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login, Wrong Paasword");
  }

  return user;
};

//Middlewear (Hashing the plain text password before saving)
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//ResetPassword
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Delete user All Data when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Work.deleteMany({ owner: user._id });
  await Project.deleteMany({ owner: user._id });
  await Contact.deleteMany({ owner: user._id });
  await About.deleteMany({ owner: user._id });
  await Skill.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
