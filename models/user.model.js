const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  // role: {
  //   type: String,
  //   required: true,
  //   enum: [process.env.STUDENT, process.env.TEACHER],
  // },
  role: [
    {
      type: String,
      required: true,
      enum: [process.env.STUDENT, process.env.TEACHER],
    },
  ],

  isVerified: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    select: false,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (this.isModified("password") || this.isNew) {
    try {
      const hash = bcrypt.hashSync(user.password, 8);
      user.password = hash;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    return next();
  }
});

module.exports = model("user", userSchema);
