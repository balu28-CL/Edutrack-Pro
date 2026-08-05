const Notice = require("../models/Notice");

// Create Notice
const createNotice = async (req, res) => {

    try {

        const notice = await Notice.create(req.body);

        res.status(201).json(notice);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Get All Notices
const getAllNotices = async (req, res) => {

    try {

        const notices = await Notice.find()
            .populate("postedBy");

        res.status(200).json(notices);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Get Notice By ID
const getNoticeById = async (req, res) => {

    try {

        const notice = await Notice.findById(req.params.id)
            .populate("postedBy");

        if (!notice) {
            return res.status(404).json({
                message: "Notice not found"
            });
        }

        res.status(200).json(notice);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Update Notice
const updateNotice = async (req, res) => {

    try {

        const notice = await Notice.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!notice) {
            return res.status(404).json({
                message: "Notice not found"
            });
        }

        res.status(200).json(notice);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Delete Notice
const deleteNotice = async (req, res) => {

    try {

        const notice = await Notice.findByIdAndDelete(req.params.id);

        if (!notice) {
            return res.status(404).json({
                message: "Notice not found"
            });
        }

        res.status(200).json({
            message: "Notice deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    createNotice,
    getAllNotices,
    getNoticeById,
    updateNotice,
    deleteNotice
};