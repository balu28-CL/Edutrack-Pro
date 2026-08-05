const express = require("express");
const router = express.Router();

const {
    getDashboardStats
} = require("../controllers/dashboardController");

// Dashboard Stats
router.get("/", getDashboardStats);

module.exports = router;