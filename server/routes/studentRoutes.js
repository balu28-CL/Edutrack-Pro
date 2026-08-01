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
router.post("/", protect, authorize("admin"), addStudent);

router.get("/", protect, getStudents);

router.put("/:id", protect, authorize("admin"), updateStudent);

router.delete("/:id", protect, authorize("admin"), deleteStudent);

module.exports = router;