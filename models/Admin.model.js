const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxLength: 30,
    required: true,
  },
  lastName: {
    type: String,
    maxLength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPrimary: {
    type: Boolean,
    required: true,
    default: false,
  },
  refreshToken: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
