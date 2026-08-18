const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


// =========================
// ADD STUDENT
// =========================

const addStudent = async (req, res) => {

    try {

        const {
            studentId,
            name,
            email,
            phone,
            department,
            semester,
            section,
            gender
        } = req.body;


        // =========================
        // CHECK EXISTING USER
        // =========================

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {

            return res.status(400).json({
                message: "A user with this email already exists"
            });

        }


        // =========================
        // CHECK EXISTING STUDENT ID
        // =========================

        const existingStudent = await Student.findOne({
            studentId
        });

        if (existingStudent) {

            return res.status(400).json({
                message: "Student ID already exists"
            });

        }


        // =========================
        // GENERATE INITIAL PASSWORD
        // =========================

        const initialPassword =
            studentId + "@123";


        // =========================
        // HASH PASSWORD
        // =========================

        const hashedPassword =
            await bcrypt.hash(initialPassword, 10);


        // =========================
        // CREATE USER ACCOUNT
        // =========================

        const user = await User.create({

            name,

            email,

            password: hashedPassword,

            role: "student"

        });


        // =========================
        // CREATE STUDENT PROFILE
        // =========================

        const student = await Student.create({

            studentId,

            user: user._id,

            name,

            email,

            phone,

            department,

            semester,

            section,

            gender

        });


        // =========================
        // RETURN STUDENT + LOGIN INFO
        // =========================

        res.status(201).json({

            message: "Student added successfully",

            student,

            loginCredentials: {

                email,

                password: initialPassword

            }

        });

    } catch (error) {

        console.log(
            "ADD STUDENT ERROR:",
            error
        );


        // =========================
        // CLEANUP USER IF STUDENT
        // CREATION FAILED
        // =========================

        if (
            error.code === 11000
        ) {

            return res.status(400).json({

                message:
                    "Student ID or email already exists"

            });

        }


        res.status(500).json({

            message: error.message

        });

    }

};


// =========================
// GET ALL STUDENTS
// =========================

const getStudents = async (req, res) => {

    try {

        const students =
            await Student.find();

        res.status(200).json(students);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// =========================
// UPDATE STUDENT
// =========================

const updateStudent = async (req, res) => {

    try {

        const student =
            await Student.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!student) {

            return res.status(404).json({

                message:
                    "Student not found"

            });

        }


        res.status(200).json(student);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// =========================
// DELETE STUDENT
// =========================

const deleteStudent = async (req, res) => {

    try {

        const student =
            await Student.findByIdAndDelete(
                req.params.id
            );


        if (!student) {

            return res.status(404).json({

                message:
                    "Student not found"

            });

        }


        // Also delete linked User account

        if (student.user) {

            await User.findByIdAndDelete(
                student.user
            );

        }


        res.status(200).json({

            message:
                "Student deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


module.exports = {

    addStudent,

    getStudents,

    updateStudent,

    deleteStudent

};