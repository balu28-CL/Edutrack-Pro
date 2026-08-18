const express = require("express");

const router = express.Router();

const {
    createAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


// Get attendance
// Admin + Faculty + Student
router.get(
    "/",
    protect,
    authorize("admin", "faculty", "student"),
    getAllAttendance
);


// Get attendance by ID
// Admin + Faculty + Student
router.get(
    "/:id",
    protect,
    authorize("admin", "faculty", "student"),
    getAttendanceById
);


// Create attendance
// Admin + Faculty ONLY
router.post(
    "/",
    protect,
    authorize("admin", "faculty"),
    createAttendance
);


// Update attendance
// Admin + Faculty ONLY
router.put(
    "/:id",
    protect,
    authorize("admin", "faculty"),
    updateAttendance
);


// Delete attendance
// Admin + Faculty ONLY
router.delete(
    "/:id",
    protect,
    authorize("admin", "faculty"),
    deleteAttendance
);


module.exports = router;