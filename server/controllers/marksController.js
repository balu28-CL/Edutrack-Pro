const Marks = require("../models/Marks");

// Create Marks
const createMarks = async (req, res) => {

    try {

        // Business Validation
        if (req.body.marksObtained > req.body.maximumMarks) {
            return res.status(400).json({
                message: "Marks obtained cannot be greater than maximum marks"
            });
        }

        const marks = await Marks.create(req.body);

        res.status(201).json(marks);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Get All Marks
const getAllMarks = async (req, res) => {

    try {

        const marks = await Marks.find()
            .populate("student")
            .populate("faculty");

        res.status(200).json(marks);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Get Marks By ID
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

        res.status(200).json(marks);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Update Marks
const updateMarks = async (req, res) => {

    try {

        // Business Validation
        if (
            req.body.marksObtained !== undefined &&
            req.body.maximumMarks !== undefined &&
            req.body.marksObtained > req.body.maximumMarks
        ) {
            return res.status(400).json({
                message: "Marks obtained cannot be greater than maximum marks"
            });
        }

        const marks = await Marks.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!marks) {
            return res.status(404).json({
                message: "Marks record not found"
            });
        }

        res.status(200).json(marks);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Delete Marks
const deleteMarks = async (req, res) => {

    try {

        const marks = await Marks.findByIdAndDelete(req.params.id);

        if (!marks) {
            return res.status(404).json({
                message: "Marks record not found"
            });
        }

        res.status(200).json({
            message: "Marks deleted successfully"
        });

    } catch (error) {

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