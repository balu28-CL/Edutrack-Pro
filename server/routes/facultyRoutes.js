const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    addFaculty,
    getFaculty,
    updateFaculty,
    deleteFaculty
} = require("../controllers/facultyController");

// Faculty Routes
router
    .route("/")
    .post(protect, authorize("admin"), addFaculty)
    .get(protect, getFaculty);

router
    .route("/:id")
    .put(protect, authorize("admin"), updateFaculty)
    .delete(protect, authorize("admin"), deleteFaculty);

module.exports = router;