// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  degree: String,
  institution: String,
  year: String,
  interests: [String],
  achievements: [String],
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
