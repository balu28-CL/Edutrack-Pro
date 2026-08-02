const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");


const {
    addStudent,
    getStudents,
    updateStudent,
    deleteStudent

} = require("../controllers/studentController");

const authorize = require("../middleware/roleMiddleware");
router
    .route("/")
    .post(protect, authorize("admin"), addStudent)
    .get(protect, getStudents);

router
    .route("/:id")
    .put(protect, authorize("admin"), updateStudent)
    .delete(protect, authorize("admin"), deleteStudent);

module.exports = router;