const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        courseCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        courseName: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        semester: {
            type: Number,
            required: true
        },

        section: {
            type: String,
            required: true,
            trim: true
        },

        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
            required: true
        },

        credits: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Course", courseSchema);