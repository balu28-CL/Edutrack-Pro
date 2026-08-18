const Marks = require("../models/Marks");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

// =========================
// CREATE MARKS
// =========================

const createMarks = async (req, res) => {

    const student = await Student.findById(req.body.student);

if (!student) {
    return res.status(404).json({
        message: "Student not found"
    });
}
    try {

        // Validate marks
        if (
            Number(req.body.marksObtained) >
            Number(req.body.maximumMarks)
        ) {
            return res.status(400).json({
                message:
                    "Marks obtained cannot be greater than maximum marks"
            });
        }

        let facultyId;

        // -------------------------
        // ADMIN
        // -------------------------

        if (req.user.role === "admin") {

    facultyId = req.body.faculty;

    if (!facultyId) {
        return res.status(400).json({
            message: "Faculty is required"
        });
    }

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
        return res.status(404).json({
            message: "Faculty not found"
        });
    }
}

        // -------------------------
        // FACULTY
        // -------------------------

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

            facultyId = faculty._id;
        }

        // -------------------------
        // CREATE
        // -------------------------

        const marks = await Marks.create({
            ...req.body,
            faculty: facultyId
        });

        const populatedMarks =
            await Marks.findById(marks._id)
                .populate("student")
                .populate("faculty");

        res.status(201).json(populatedMarks);

    } catch (error) {

        console.log("CREATE MARKS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// =========================
// GET ALL MARKS
// =========================

const getAllMarks = async (req, res) => {
    try {

        // =========================
        // STUDENT
        // =========================

        if (req.user.role === "student") {

            const student = await Student.findOne({
                user: req.user.id
            });

            if (!student) {
                return res.status(200).json([]);
            }

            const marks = await Marks.find({
                student: student._id
            })
                .populate("student")
                .populate("faculty")
                .sort({ createdAt: -1 });

            return res.status(200).json(marks);
        }


        // =========================
        // FACULTY
        // =========================

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

            const marks = await Marks.find({
                faculty: faculty._id
            })
                .populate("student")
                .populate("faculty")
                .sort({ createdAt: -1 });

            return res.status(200).json(marks);
        }


        // =========================
        // ADMIN
        // =========================

        if (req.user.role === "admin") {

            const marks = await Marks.find()
                .populate("student")
                .populate("faculty")
                .sort({ createdAt: -1 });

            return res.status(200).json(marks);
        }


        return res.status(403).json({
            message: "Access denied"
        });

    } catch (error) {

        console.log("GET MARKS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// =========================
// GET MARKS BY ID
// =========================

const getMarksById = async (req, res) => {
    try {

        const marks = await Marks.findById(req.params.id)
            .populate("student")
            .populate("faculty");

        if (!marks) {
            return res.status(404).json({
                message: "Marks record not found"
            });
        }


        // =========================
        // ADMIN
        // =========================

        if (req.user.role === "admin") {
            return res.status(200).json(marks);
        }


        // =========================
        // FACULTY
        // =========================

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
                marks.faculty._id.toString() !==
                faculty._id.toString()
            ) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            return res.status(200).json(marks);
        }


        // =========================
        // STUDENT
        // =========================

        if (req.user.role === "student") {

            const student = await Student.findOne({
                user: req.user.id
            });

            if (!student) {
                return res.status(404).json({
                    message:
                        "Student profile not linked to this account"
                });
            }

            if (
                marks.student._id.toString() !==
                student._id.toString()
            ) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            return res.status(200).json(marks);
        }


        return res.status(403).json({
            message: "Access denied"
        });

    } catch (error) {

        console.log("GET MARKS BY ID ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// =========================
// UPDATE MARKS
// =========================

const updateMarks = async (req, res) => {
    try {

        // -------------------------
        // Validate marks
        // -------------------------

        const existingMarks = await Marks.findById(req.params.id);

if (!existingMarks) {
    return res.status(404).json({
        message: "Marks record not found"
    });
}

const marksObtained =
    req.body.marksObtained !== undefined
        ? Number(req.body.marksObtained)
        : existingMarks.marksObtained;

const maximumMarks =
    req.body.maximumMarks !== undefined
        ? Number(req.body.maximumMarks)
        : existingMarks.maximumMarks;

if (marksObtained > maximumMarks) {
    return res.status(400).json({
        message:
            "Marks obtained cannot be greater than maximum marks"
    });
}

        // =========================
        // FACULTY OWNERSHIP CHECK
        // =========================

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
                existingMarks.faculty.toString() !==
                faculty._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only update marks assigned to you"
                });
            }


            // Faculty cannot change the faculty owner
            req.body.faculty = faculty._id;
        }


        // =========================
        // UPDATE
        // =========================

        const updatedMarks =
            await Marks.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            )
                .populate("student")
                .populate("faculty");

        res.status(200).json(updatedMarks);

    } catch (error) {

        console.log("UPDATE MARKS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// =========================
// DELETE MARKS
// =========================

const deleteMarks = async (req, res) => {
    try {

        const marks =
            await Marks.findById(req.params.id);

        if (!marks) {
            return res.status(404).json({
                message: "Marks record not found"
            });
        }


        // =========================
        // FACULTY OWNERSHIP CHECK
        // =========================

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
                marks.faculty.toString() !==
                faculty._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only delete marks assigned to you"
                });
            }
        }


        await Marks.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Marks deleted successfully"
        });

    } catch (error) {

        console.log("DELETE MARKS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createMarks,
    getAllMarks,
    getMarksById,
    updateMarks,
    deleteMarks
};