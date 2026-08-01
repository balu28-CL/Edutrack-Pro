const Student = require("../models/Student");

// Add Student
const addStudent = async (req, res) => {

    try {

        const student = await Student.create(req.body);

        res.status(201).json(student);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Get All Students
const getStudents = async (req, res) => {

    try {

        const students = await Student.find();

        res.status(200).json(students);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Update Student
const updateStudent = async (req, res) => {

    try {

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const deleteStudent = async (req, res) => {

    try {

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully"
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