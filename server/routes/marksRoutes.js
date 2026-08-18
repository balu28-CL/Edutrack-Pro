const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createMarks,
    getAllMarks,
    getMarksById,
    updateMarks,
    deleteMarks
} = require("../controllers/marksController");


// Create Marks
router.post(
    "/",
    protect,
    authorize("admin", "faculty"),
    createMarks
);


// Get All Marks
router.get(
    "/",
    protect,
    getAllMarks
);


// Get Marks By ID
router.get(
    "/:id",
    protect,
    getMarksById
);


// Update Marks
router.put(
    "/:id",
    protect,
    authorize("admin", "faculty"),
    updateMarks
);


// Delete Marks
router.delete(
    "/:id",
    protect,
    authorize("admin", "faculty"),
    deleteMarks
);


module.exports = router;