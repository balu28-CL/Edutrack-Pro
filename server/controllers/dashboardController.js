const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Notice = require("../models/Notice");

const getDashboardStats = async (req, res) => {
    try {

        // =========================================
        // STUDENT DASHBOARD
        // =========================================

        if (req.user.role === "student") {

            // Find student profile linked to logged-in user
            const student = await Student.findOne({
                user: req.user.id
            });

            if (!student) {
                return res.status(404).json({
                    message: "Student profile not linked to this account"
                });
            }


            // =========================================
            // STUDENT ATTENDANCE
            // =========================================

            const attendanceRecords = await Attendance.find({
                student: student._id
            });

            const totalAttendance = attendanceRecords.length;

            const presentAttendance = attendanceRecords.filter(
                (record) => record.status === "Present"
            ).length;

            let attendancePercentage = 0;

            if (totalAttendance > 0) {
                attendancePercentage = (
                    (presentAttendance / totalAttendance) * 100
                ).toFixed(2);
            }


            // =========================================
            // STUDENT MARKS
            // =========================================

            const marks = await Marks.find({
                student: student._id
            })
                .populate("faculty")
                .sort({ createdAt: -1 });


            // =========================================
            // STUDENT NOTICES
            // Only All + Students
            // =========================================

            const recentNotices = await Notice.find({
                expiryDate: {
                    $gte: new Date()
                },

                audience: {
                    $in: ["All", "Students"]
                }
            })
                .populate("postedBy", "name")
                .sort({ createdAt: -1 })
                .limit(3);


            // =========================================
            // STUDENT RESPONSE
            // =========================================

            return res.status(200).json({

                student: {
                    id: student._id,
                    studentId: student.studentId,
                    name: student.name,
                    email: student.email,
                    department: student.department,
                    semester: student.semester,
                    section: student.section
                },

                attendance: {
                    total: totalAttendance,
                    present: presentAttendance,
                    percentage: attendancePercentage
                },

                marks,

                recentNotices
            });
        }


        // =========================================
        // ADMIN / FACULTY DASHBOARD
        // =========================================

        const totalStudents =
            await Student.countDocuments();

        const totalFaculty =
            await Faculty.countDocuments();

        const totalAttendanceRecords =
            await Attendance.countDocuments();

        const totalMarksRecords =
            await Marks.countDocuments();


        // =========================================
        // ACTIVE NOTICES
        // =========================================

        const activeNotices =
            await Notice.countDocuments({
                expiryDate: {
                    $gte: new Date()
                }
            });


        // =========================================
        // RECENT NOTICES
        // IMPORTANT:
        // Admin -> All audiences
        // Faculty -> All + Faculty
        // =========================================

        let noticeFilter = {
            expiryDate: {
                $gte: new Date()
            }
        };


        if (req.user.role === "faculty") {

            noticeFilter.audience = {
                $in: ["All", "Faculty"]
            };

        } else if (req.user.role === "admin") {

            // Admin sees all non-expired notices.
            // No audience filter required.

        } else {

            return res.status(403).json({
                message: "Access denied"
            });
        }


        console.log("DASHBOARD ROLE:", req.user.role);
        console.log("DASHBOARD NOTICE FILTER:", noticeFilter);


        const recentNotices =
            await Notice.find(noticeFilter)
                .populate("postedBy", "name")
                .sort({ createdAt: -1 })
                .limit(3);


        console.log(
            "DASHBOARD NOTICES FOUND:",
            recentNotices.length
        );


// =========================================
// ATTENDANCE PERCENTAGE
// =========================================

const presentAttendanceRecords =
    await Attendance.countDocuments({
        status: "Present"
    });

let attendancePercentage = 0;

if (totalAttendanceRecords > 0) {

    attendancePercentage = (
        (presentAttendanceRecords / totalAttendanceRecords) * 100
    ).toFixed(2);

}

        // =========================================
        // ADMIN / FACULTY RESPONSE
        // =========================================

        return res.status(200).json({

            totalStudents,

            totalFaculty,

            totalAttendanceRecords,

            totalMarksRecords,

            activeNotices,

            recentNotices,

            attendancePercentage

        });

    } catch (error) {

        console.log("DASHBOARD ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }
};


module.exports = {
    getDashboardStats
};