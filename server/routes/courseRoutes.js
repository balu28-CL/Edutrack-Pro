const express = require("express");

const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


// Get all courses
// Admin + Faculty
router.get(
    "/",
    protect,
    authorize("admin", "faculty", "student"),
    getAllCourses
);


// Get course by ID
// Admin + Faculty
router.get(
    "/:id",
    protect,
    authorize("admin", "faculty", "student"),
    getCourseById
);


// Create course
// Admin + Faculty
router.post(
    "/",
    protect,
    authorize("admin", "faculty"),
    createCourse
);


// Update course
// Admin + Faculty
router.put(
    "/:id",
    protect,
    authorize("admin", "faculty"),
    updateCourse
);


// Delete course
// Admin + Faculty
router.delete(
    "/:id",
    protect,
    authorize("admin", "faculty"),
    deleteCourse
);


module.exports = router;