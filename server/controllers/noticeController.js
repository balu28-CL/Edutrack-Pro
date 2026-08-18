const Notice = require("../models/Notice");
const Faculty = require("../models/Faculty");

// Create Notice
const createNotice = async (req, res) => {
    try {
        let postedBy;

        // If faculty is creating the notice,
        // find their Faculty profile using the logged-in User ID
        if (req.user.role === "faculty") {
            const faculty = await Faculty.findOne({
                user: req.user.id
            });

            if (!faculty) {
                return res.status(404).json({
                    message: "Faculty profile not linked to this account"
                });
            }

            postedBy = faculty._id;
        }

        // Admin can still provide a Faculty ID if needed
        if (req.user.role === "admin") {
            postedBy = req.body.postedBy;
        }

        const notice = await Notice.create({
            ...req.body,
            postedBy
        });

        const populatedNotice = await Notice.findById(notice._id)
            .populate("postedBy");

        res.status(201).json(populatedNotice);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Notices
const getAllNotices = async (req, res) => {
    try {

        console.log("USER ROLE:", req.user.role);

        let filter = {
            expiryDate: {
                $gte: new Date()
            }
        };

        if (req.user.role === "student") {

            filter.audience = {
                $in: ["All", "Students"]
            };

        } else if (req.user.role === "faculty") {

            filter.audience = {
                $in: ["All", "Faculty"]
            };

        } else if (req.user.role === "admin") {

            // Admin sees every non-expired notice.
            // No audience filter here.

        } else {

            return res.status(403).json({
                message: "Access denied"
            });

        }

        console.log("NOTICE FILTER:", filter);

        const notices = await Notice.find(filter)
            .populate("postedBy");

        console.log("NOTICES FOUND:", notices.length);

        res.status(200).json(notices);

    } catch (error) {

        console.log("NOTICE ERROR:", error);

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
).populate("postedBy");

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