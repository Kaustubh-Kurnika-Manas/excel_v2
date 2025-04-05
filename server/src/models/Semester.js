const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
    {
        student_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        year: {
            type: String,
            required: true,
            enum: ['I', 'II', 'III', 'IV']
        },
        courses: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);
/**
 *  A course is represented as an object with the following properties.
 *  So courses in a year is represented as an array of all the individual courses
 *  courses: [{
 *              code: String,
 *              title: String,
 *              credit: Number,
 *              type: String,
 *              grade: String,
 *           }]
 */

module.exports = mongoose.model("Semester", semesterSchema);
