// backend/models/student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  sex: { type: String, required: true },
  age: { type: Number, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  interests: [String], // Array of strings for interests
  experience: {
    hasExperience: Boolean,
    degreeCount: Number,
  },
  profilePicture: String, // URL of the profile picture
  approved: { type: Boolean, default: false },
  approvedDate: Date,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
