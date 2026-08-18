const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");


// Create Enrollment
const createEnrollment = async (req, res) => {
    try {

        const { student, course } = req.body;


        // Check student exists
        const studentExists =
            await Student.findById(student);

        if (!studentExists) {
            return res.status(404).json({
                message: "Student not found"
            });
        }


        // Check course exists
        const courseExists =
            await Course.findById(course);

        if (!courseExists) {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        // Check duplicate enrollment
        const existingEnrollment =
            await Enrollment.findOne({
                student,
                course
            });

        if (existingEnrollment) {
            return res.status(400).json({
                message:
                    "Student is already enrolled in this course"
            });
        }


        const enrollment =
            await Enrollment.create({
                student,
                course
            });


        const populatedEnrollment =
            await Enrollment.findById(
                enrollment._id
            )
            .populate("student")
            .populate({
                path: "course",
                populate: {
                    path: "faculty"
                }
            });


        res.status(201).json(
            populatedEnrollment
        );

    } catch (error) {

        console.log(
            "CREATE ENROLLMENT ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};



// Get all enrollments
const getAllEnrollments = async (req, res) => {
    try {

        const enrollments =
            await Enrollment.find()
                .populate("student")
                .populate({
                    path: "course",
                    populate: {
                        path: "faculty"
                    }
                });


        res.status(200).json(
            enrollments
        );

    } catch (error) {

        console.log(
            "GET ENROLLMENTS ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};



// Get enrollments for a particular student
const getStudentEnrollments = async (req, res) => {
    try {

        if (req.user.role === "student") {

            const loggedInStudent =
                await Student.findOne({
                    user: req.user.id
                });

            if (!loggedInStudent) {
                return res.status(404).json({
                    message: "Student profile not found"
                });
            }

            if (
                loggedInStudent._id.toString() !==
                req.params.studentId
            ) {
                return res.status(403).json({
                    message:
                        "You can only view your own enrollments"
                });
            }
        }


        const enrollments =
            await Enrollment.find({
                student: req.params.studentId
            })
            .populate("student")
            .populate({
                path: "course",
                populate: {
                    path: "faculty"
                }
            });


        res.status(200).json(
            enrollments
        );

    } catch (error) {

        console.log(
            "GET STUDENT ENROLLMENTS ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};



// Delete Enrollment
const deleteEnrollment = async (req, res) => {
    try {

        const enrollment =
            await Enrollment.findById(
                req.params.id
            );

        if (!enrollment) {
            return res.status(404).json({
                message:
                    "Enrollment not found"
            });
        }


        await Enrollment.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({
            message:
                "Student unenrolled successfully"
        });

    } catch (error) {

        console.log(
            "DELETE ENROLLMENT ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};



module.exports = {
    createEnrollment,
    getAllEnrollments,
    getStudentEnrollments,
    deleteEnrollment
};