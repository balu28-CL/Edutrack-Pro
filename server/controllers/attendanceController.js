const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

// Create Attendance
const createAttendance = async (req, res) => {
    try {

        const { student, faculty, subject, date, status, remarks } = req.body;


        // Student must exist
        const studentProfile = await Student.findById(student);

        if (!studentProfile) {
            return res.status(404).json({
                message: "Student not found"
            });
        }


        // Faculty must exist
        const facultyProfile = await Faculty.findById(faculty);

        if (!facultyProfile) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }


        // If faculty is creating attendance,
        // make sure the faculty ID belongs to their account.
        if (req.user.role === "faculty") {

            if (
                !facultyProfile.user ||
                facultyProfile.user.toString() !== req.user.id
            ) {
                return res.status(403).json({
                    message: "You can only create attendance using your own faculty profile"
                });
            }
        }


        const attendance = await Attendance.create({
            student,
            faculty,
            subject,
            date,
            status,
            remarks
        });


        const populatedAttendance =
            await Attendance.findById(attendance._id)
                .populate("student")
                .populate("faculty");


        res.status(201).json(populatedAttendance);

    } catch (error) {

        console.log("CREATE ATTENDANCE ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// Get Attendance
// Get Attendance
const getAllAttendance = async (req, res) => {

    try {

        // ADMIN and FACULTY can see all attendance
        if (
            req.user.role === "admin" ||
            req.user.role === "faculty"
        ) {

            const attendance = await Attendance.find()
                .populate("student")
                .populate("faculty");

            return res.status(200).json(attendance);
        }


        // STUDENT can only see their own attendance

        if (req.user.role === "student") {

            const student = await Student.findOne({
                user: req.user.id
            });

            if (!student) {

                return res.status(404).json({
                    message: "Student profile not linked to this account"
                });

            }

            const attendance = await Attendance.find({
                student: student._id
            })
                .populate("student")
                .populate("faculty");

            return res.status(200).json(attendance);
        }


        return res.status(403).json({
            message: "Access denied"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Get Attendance By ID
// Get Attendance By ID
const getAttendanceById = async (req, res) => {

    try {

        const attendance = await Attendance.findById(req.params.id)
            .populate("student")
            .populate("faculty");

        if (!attendance) {

            return res.status(404).json({
                message: "Attendance record not found"
            });

        }


        // Admin and Faculty can access any record

        if (
            req.user.role === "admin" ||
            req.user.role === "faculty"
        ) {

            return res.status(200).json(attendance);
        }


        // Student can access only their own record

        if (req.user.role === "student") {

            const student = await Student.findOne({
                user: req.user.id
            });

            if (!student) {

                return res.status(404).json({
                    message: "Student profile not linked to this account"
                });

            }

            if (
                attendance.student._id.toString() !==
                student._id.toString()
            ) {

                return res.status(403).json({
                    message: "Access denied"
                });

            }

            return res.status(200).json(attendance);
        }


        return res.status(403).json({
            message: "Access denied"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Update Attendance
const updateAttendance = async (req, res) => {
    try {

        const attendance =
            await Attendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }


        // Faculty can only modify attendance
        // associated with their own faculty profile.
        if (req.user.role === "faculty") {

            const faculty = await Faculty.findOne({
                user: req.user.id
            });

            if (!faculty) {
                return res.status(404).json({
                    message: "Faculty profile not linked to this account"
                });
            }


            if (
                attendance.faculty.toString() !==
                faculty._id.toString()
            ) {
                return res.status(403).json({
                    message: "You cannot modify this attendance record"
                });
            }


            // Prevent faculty from changing ownership
            // to another faculty/student.
            if (
                req.body.faculty &&
                req.body.faculty !== faculty._id.toString()
            ) {
                return res.status(403).json({
                    message: "You cannot change the faculty for this record"
                });
            }
        }


        const updatedAttendance =
            await Attendance.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            )
            .populate("student")
            .populate("faculty");


        res.status(200).json(updatedAttendance);

    } catch (error) {

        console.log("UPDATE ATTENDANCE ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// Delete Attendance
const deleteAttendance = async (req, res) => {
    try {

        // Only admin and faculty can delete
        if (
            req.user.role !== "admin" &&
            req.user.role !== "faculty"
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const attendance =
            await Attendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        // Faculty can delete only their own records
        if (req.user.role === "faculty") {

            const faculty = await Faculty.findOne({
                user: req.user.id
            });

            if (!faculty) {
                return res.status(404).json({
                    message:
                        "Faculty profile not linked to this account"
                });
            }

            if (
                attendance.faculty.toString() !==
                faculty._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only delete attendance records assigned to you"
                });
            }
        }

        await Attendance.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Attendance deleted successfully"
        });

    } catch (error) {

        console.log("DELETE ATTENDANCE ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
};