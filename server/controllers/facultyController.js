const Faculty = require("../models/Faculty");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Add Faculty
const addFaculty = async (req, res) => {

    try {

        const {
            facultyId,
            name,
            email,
            phone,
            department,
            designation,
            gender
        } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "A user with this email already exists"
            });
        }

        // Initial password
        // Admin can change/update it later
        const hashedPassword = await bcrypt.hash(
            facultyId,
            10
        );

        // Create login account
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "faculty"
        });

        try {

            // Create faculty profile and link User
            const faculty = await Faculty.create({
                facultyId,
                user: user._id,
                name,
                email,
                phone,
                department,
                designation,
                gender
            });

            res.status(201).json(faculty);

        } catch (facultyError) {

            // If faculty creation fails,
            // remove the User that we just created
            await User.findByIdAndDelete(user._id);

            throw facultyError;
        }

    } catch (error) {

        console.log("ADD FACULTY ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }

};


// Get All Faculty
const getFaculty = async (req, res) => {

    try {

        const faculty = await Faculty.find();

        res.status(200).json(faculty);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Update Faculty
const updateFaculty = async (req, res) => {

    try {

        const faculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        res.status(200).json(faculty);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Delete Faculty
const deleteFaculty = async (req, res) => {

    try {

        const faculty = await Faculty.findByIdAndDelete(
            req.params.id
        );

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        // Also delete the linked login account
        if (faculty.user) {
            await User.findByIdAndDelete(faculty.user);
        }

        res.status(200).json({
            message: "Faculty deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {
    addFaculty,
    getFaculty,
    updateFaculty,
    deleteFaculty
};