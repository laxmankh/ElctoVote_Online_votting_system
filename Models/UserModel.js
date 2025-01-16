const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number, // Correct capitalization
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Regex to validate email format
  },
  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Regex to validate mobile number (10 digits)
  },
  address: {
    type: String,
    required: true,
  },
  votecardnumber: {
    type: String,
    required: true,
    unique: true,
  },
  adharcardnumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{12}$/, // Regex to validate Aadhaar card number (12 digits)
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    required: true,
  },
  isvoted: {
    type: Boolean,
    default: false,
  },
});

const user = mongoose.model("user", UserSchema);
module.exports = user;
