const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        status: {
            type: String,
            enum: ["Active", "Completed", "Dropped"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);


// Prevent the same student from being enrolled
// in the same course more than once
enrollmentSchema.index(
    {
        student: 1,
        course: 1
    },
    {
        unique: true
    }
);


module.exports = mongoose.model(
    "Enrollment",
    enrollmentSchema
);