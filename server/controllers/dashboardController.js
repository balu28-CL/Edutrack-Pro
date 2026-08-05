const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Notice = require("../models/Notice");

const getDashboardStats = async (req, res) => {

    try {

        const totalStudents = await Student.countDocuments();

        const totalFaculty = await Faculty.countDocuments();

        const totalAttendanceRecords = await Attendance.countDocuments();

        const totalMarksRecords = await Marks.countDocuments();

        const activeNotices = await Notice.countDocuments({
    expiryDate: {
        $gte: new Date()
    }
});
const recentNotices = await Notice.find()
    .populate("postedBy", "name")
    .sort({ createdAt: -1 })
    .limit(5);
    let attendancePercentage = 0;

if (totalStudents > 0) {
    attendancePercentage = (
        (totalAttendanceRecords / totalStudents) * 100
    ).toFixed(2);
}

       res.status(200).json({

    totalStudents,
    totalFaculty,
    totalAttendanceRecords,
    totalMarksRecords,

    activeNotices,

    recentNotices,
    attendancePercentage

});

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    getDashboardStats
};