const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Role = require("../utils/roles");

//env config
dotenv.config();

const studentSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        firstname: {
            type: String,
            required: true,
            trim: true,
        },
        middlename: {
            type: String,
            trim: true,
        },
        lastname: {
            type: String,
            trim: true,
        },
        phone_no: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            trim: true,
        },
        blood_group: {
            type: String,
            trim: true,
        },
        home_place: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        guardian_name: {
            type: String,
            trim: true,
        },
        guardian_ph_no: {
            type: String,
            trim: true,
        },
        guardian_address: {
            type: String,
            trim: true,
        },
        family_details: {
            type: String,
            trim: true,
        },
        hobbies: {
            type: String,
            trim: true,
        },
        enrollment_no: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        year: {
            type: String,
            required: true,
            enum: ['I', 'II', 'III', 'IV']
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },
        programme: {
            type: String,
            trim: true,
        },
        enrollment_year: {
            type: String,
            trim: true,
        },
        hostel_name: {
            type: String,
            trim: true,
        },
        hostel_room_no: {
            type: String,
            trim: true,
        },
        warden_name: {
            type: String,
            trim: true,
        },
        warden_ph_no: {
            type: String,
            trim: true,
        },
        asst_warden_name: {
            type: String,
            trim: true,
        },
        asst_warden_ph_no: {
            type: String,
            trim: true,
        },
        responsible_contact_person_at_residence: {
            type: String,
            trim: true,
        },
        contact_no_of_contact_person: {
            type: String,
            trim: true,
        },
        responsible_contact_address: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            default: Role.Student,
        },
        mentoredBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mentor"
        }],
        avatar: {
            type: Object,
            default: { url: "" },
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        passwordResetToken: String,
        emailVerifyToken: {
            type: String,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isBanned: {
            type: Boolean,
            default: false
        },
        class_10_board: {
            type: String,
            trim: true,
        },
        class_10_school: {
            type: String,
            trim: true,
        },
        class_10_percentage: {
            type: String,
            trim: true,
        },
        class_12_board: {
            type: String,
            trim: true,
        },
        class_12_school: {
            type: String,
            trim: true,
        },
        class_12_percentage: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// hiding sensitive info from user
studentSchema.methods.toJSON = function () {
    const student = this;
    const studentObject = student.toObject();

    delete studentObject.password;
    delete studentObject.tokens;
    // delete studentObject.role;

    return studentObject;
};

/**
 * These methods will available on the instances of the model. Unlike Model.statics,
 * Model.methods are available on all instances of the Admin model.
 */
// generate auth token function
studentSchema.methods.generateAuthToken = async function () {
    const student = this;
    const token = jwt.sign(
        { _id: student._id.toString(), role: "Student" },
        process.env.JWT_SECRET
    );
    // student.tokens = student.tokens.concat({ token });
    student.tokens = { token };
    await student.save();
    return token;
};

/**
 *   Model.Statics methods are available on the Model itself.  **/
//custom login method for mentor
studentSchema.statics.findByCredentials = async (email, password) => {
    const student = await Student.findOne({ email });

    if (!student) {
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
        console.log("Password error");
        throw new Error("Unable to login");
    }
    return student;
};

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
