const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const protect = require("./middleware/authMiddleware");
const studentRoutes = require("./routes/studentRoutes");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
    res.send("EduTrack Pro Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/api/protected", protect, (req, res) => {

    res.json({
        message: "Protected Route Access Granted",
        user: req.user
    });

});