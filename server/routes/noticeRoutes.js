const express = require("express");
const router = express.Router();

const {
    createNotice,
    getAllNotices,
    getNoticeById,
    updateNotice,
    deleteNotice
} = require("../controllers/noticeController");

// Create Notice
router.post("/", createNotice);

// Get All Notices
router.get("/", getAllNotices);

// Get Notice By ID
router.get("/:id", getNoticeById);

// Update Notice
router.put("/:id", updateNotice);

// Delete Notice
router.delete("/:id", deleteNotice);

module.exports = router;