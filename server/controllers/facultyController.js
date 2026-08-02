const Faculty = require("../models/Faculty");

// Add Faculty
const addFaculty = async (req, res) => {

    try {

        const faculty = await Faculty.create(req.body);

        res.status(201).json(faculty);

    } catch (error) {

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

        const faculty = await Faculty.findByIdAndDelete(req.params.id);

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
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