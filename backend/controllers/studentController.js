// backend/controllers/studentController.js
const Student = require('../models/student');
const { generateQRCode } = require('../utils/qrCodeScanner');
const { saveToGoogleSheets } = require('../utils/googleSheets');

// Register a new student (self-registration)
exports.registerStudent = async (req, res) => {
  try {
    const { fullName, studentId, sex, age, department, email, phone, interests, experience, profilePicture } = req.body;

    // Check if student already exists
    let student = await Student.findOne({ studentId });
    if (student) return res.status(400).json({ message: 'Student already registered' });

    // Save student to the database (pending approval)
    student = new Student({
      fullName,
      studentId,
      sex,
      age,
      department,
      email,
      phone,
      interests,
      experience,
      profilePicture,
      approved: false, // Pending approval
    });
    await student.save();

    res.status(201).json({ message: 'Student registered, awaiting approval' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Approve student registration
exports.approveStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the student and mark as approved
    let student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.approved = true;
    student.approvedDate = new Date();

    await student.save();

    // Generate a QR code for the student and save to Google Sheets
    await saveToGoogleSheets(student);

    res.status(200).json({ message: 'Student approved and data saved to Google Sheets' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Get list of registered students (pending approval or approved)
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Take attendance by scanning QR code (approve attendance)
exports.takeAttendance = async (req, res) => {
  try {
    const { studentId } = req.body;

    let student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (!student.approved) return res.status(400).json({ message: 'Student not approved' });

    // Mark attendance
    // (For simplicity, store the attendance date, though you can create an attendance record model)
    student.lastAttendance = new Date();
    await student.save();

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
