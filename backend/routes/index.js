// backend/routes/index.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Student routes
router.post('/students/register', studentController.registerStudent);
router.post('/students/:studentId/approve', authMiddleware, studentController.approveStudent);
router.get('/students', authMiddleware, studentController.getStudents);
router.post('/attendance', authMiddleware, studentController.takeAttendance);

// Admin routes
router.post('/admin/login', adminController.login);

module.exports = router;
