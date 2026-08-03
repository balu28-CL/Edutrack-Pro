const express = require("express");
const router = express.Router();

const {
    createAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
} = require("../controllers/attendanceController");

// Create Attendance
router.post("/", createAttendance);

// Get All Attendance
router.get("/", getAllAttendance);

// Get Attendance By ID
router.get("/:id", getAttendanceById);

// Update Attendance
router.put("/:id", updateAttendance);

// Delete Attendance
router.delete("/:id", deleteAttendance);

module.exports = router;