const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
{
    studentId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true
    },

    section: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Student", studentSchema);