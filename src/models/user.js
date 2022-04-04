const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Work = require("./work");

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
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
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "work",
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
  const token = jwt.sign(
    { _id: user._id.toString() },
    { expiresIn: "24h" },
    process.env.JWT_SECRET
  );

  await user.save();

  return token;
};

//Function for authentication of LogIn
userSchema.statics.findByCredentials = async (email, password) => {
  console.log(email);
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

// Delete user works when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Work.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;