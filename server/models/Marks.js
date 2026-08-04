const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    examType: {
      type: String,
      enum: ["Mid-1", "Mid-2", "Assignment", "Final"],
      required: true,
    },

    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },

    maximumMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Marks", marksSchema);