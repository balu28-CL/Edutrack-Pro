const express = require("express");
const router = express.Router();

const {
    createMarks,
    getAllMarks,
    getMarksById,
    updateMarks,
    deleteMarks
} = require("../controllers/marksController");

// Create Marks
router.post("/", createMarks);

// Get All Marks
router.get("/", getAllMarks);

// Get Marks By ID
router.get("/:id", getMarksById);

// Update Marks
router.put("/:id", updateMarks);

// Delete Marks
router.delete("/:id", deleteMarks);

module.exports = router;