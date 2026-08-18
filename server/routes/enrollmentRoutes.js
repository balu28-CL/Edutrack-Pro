const express = require("express");

const router = express.Router();

const {
    createEnrollment,
    getAllEnrollments,
    getStudentEnrollments,
    deleteEnrollment
} = require("../controllers/enrollmentController");

const protect  = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


// Admin / Faculty can enroll students
router.post(
    "/",
    protect,
    authorize("admin", "faculty"),
    createEnrollment
);


// Admin / Faculty can view all enrollments
router.get(
    "/",
    protect,
    authorize("admin", "faculty"),
    getAllEnrollments
);


// Student can view their own enrollments
// Admin / Faculty can view student enrollments
router.get(
    "/student/:studentId",
    protect,
    authorize("admin", "faculty", "student"),
    getStudentEnrollments
);


// Admin / Faculty can remove enrollment
router.delete(
    "/:id",
    protect,
    authorize("admin", "faculty"),
    deleteEnrollment
);


module.exports = router;