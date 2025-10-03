const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please Enter your name"],
  },
  email: {
    type: String,
    require: [true, "Please provide your Email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid Email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    require: [true, "Please provide your password"],
    minlength: 8,
    select: false,
  },
  phone: {
    type: Number,
    require: [true, "Please provide your Number"],
    minlength: 10,
    maxlength: 10,
  },
  city: {
    type: String,
    require: [true, "Please provide your city"],
  },
  country: {
    type: String,
    require: [true, "Please provide your Country"],
  },
});

// run only with send() or create()
schema.pre("save", async function (next) {
  // Hash the password with coast 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

schema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Assessment_User = mongoose.model(" Assessment_User", schema);

module.exports = Assessment_User;
