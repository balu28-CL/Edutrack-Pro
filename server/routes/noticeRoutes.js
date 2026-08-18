const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createNotice,
    getAllNotices,
    getNoticeById,
    updateNotice,
    deleteNotice
} = require("../controllers/noticeController");

// Create Notice
router.post(
    "/",
    protect,
    authorize("admin", "faculty"),
    createNotice
);

// Get All Notices
router.get(
    "/",
    protect,
    authorize("admin", "faculty", "student"),
    getAllNotices
);

// Get Notice By ID
router.get(
    "/:id",
    protect,
    authorize("admin", "faculty", "student"),
    getNoticeById
);

// Update Notice
router.put(
    "/:id",
    protect,
    authorize("admin", "faculty"),
    updateNotice
);

// Delete Notice
router.delete(
    "/:id",
    protect,
    authorize("admin", "faculty"),
    deleteNotice
);

module.exports = router;