const Course = require("../models/Course");
const Faculty = require("../models/Faculty");

// Create Course
const createCourse = async (req, res) => {
    try {
        const {
            courseCode,
            courseName,
            department,
            semester,
            section,
            faculty,
            credits
        } = req.body;

        // Check faculty exists
        const facultyProfile = await Faculty.findById(faculty);

        if (!facultyProfile) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        // Faculty can only create courses assigned to themselves
        if (req.user.role === "faculty") {

            if (
                !facultyProfile.user ||
                facultyProfile.user.toString() !== req.user.id
            ) {
                return res.status(403).json({
                    message:
                        "You can only create courses assigned to your own faculty profile"
                });
            }
        }

        const course = await Course.create({
            courseCode,
            courseName,
            department,
            semester,
            section,
            faculty,
            credits
        });

        const populatedCourse =
            await Course.findById(course._id)
                .populate("faculty");

        res.status(201).json(populatedCourse);

    } catch (error) {

        console.log("CREATE COURSE ERROR:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Course code already exists"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


// Get All Courses
const getAllCourses = async (req, res) => {
    try {

        const courses = await Course.find()
            .populate("faculty");

        res.status(200).json(courses);

    } catch (error) {

        console.log("GET COURSES ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// Get Course By ID
const getCourseById = async (req, res) => {
    try {

        const course =
            await Course.findById(req.params.id)
                .populate("faculty");

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json(course);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// Update Course
const updateCourse = async (req, res) => {
    try {

        const course =
            await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        // Faculty can only update their own courses
        if (req.user.role === "faculty") {

            const faculty =
                await Faculty.findOne({
                    user: req.user.id
                });

            if (!faculty) {
                return res.status(404).json({
                    message:
                        "Faculty profile not linked to this account"
                });
            }

            if (
                course.faculty.toString() !==
                faculty._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only update courses assigned to you"
                });
            }

            // Prevent faculty from changing ownership
            if (
                req.body.faculty &&
                req.body.faculty !==
                faculty._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You cannot change the faculty for this course"
                });
            }
        }


        const updatedCourse =
            await Course.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            )
            .populate("faculty");


        res.status(200).json(updatedCourse);

    } catch (error) {

        console.log("UPDATE COURSE ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// Delete Course
const deleteCourse = async (req, res) => {
    try {

        const course =
            await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        // Faculty can only delete their own courses
        if (req.user.role === "faculty") {

            const faculty =
                await Faculty.findOne({
                    user: req.user.id
                });

            if (!faculty) {
                return res.status(404).json({
                    message:
                        "Faculty profile not linked to this account"
                });
            }

            if (
                course.faculty.toString() !==
                faculty._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only delete courses assigned to you"
                });
            }
        }


        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Course deleted successfully"
        });

    } catch (error) {

        console.log("DELETE COURSE ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};