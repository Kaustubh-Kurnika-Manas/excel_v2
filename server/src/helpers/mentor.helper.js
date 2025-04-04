const Mentor = require("../models/Mentor");
const Student = require("../models/Student");
const adminController = require("../controllers/admin.controller");
const axios = require("axios");
const Admin = require("../models/Admin");
const response = require("../utils/responses.utils");

/**
 *  This module consists of methods which will be called inside other methods to do some simple specific tasks
 *  They acts as a helper to other functions in performing some specific tasks.
 *
 *  *** This module consists all the helper function for Mentor
 */

module.exports = {
    // this method fetch all the mentors from the db and returns it
    /**
     * @Desc This function fetches all the available mentors
     * @returns Array of Mentors
     */
    getAllMentors: async () => {
        // const mentors = await Mentor.find().select(
        //     "id firstname middlename lastname avatar assigned studentCount department designation"
        // );
        const mentors = await Mentor.find();
        return mentors;
    },

    /**
     * Automatically pairs mentors and assigns mentees based on seniority
     * Algorithm:
     * 1. Pair senior mentors with junior mentors
     * 2. Pair remaining mentors in groups of 2
     * 3. Assign mentees equally to mentor pairs
     * 4. Handle surplus mentees by assigning to last pair
     */
    autoPairMentorsAndAssignMentees: async () => {
        try {
            // Get all mentors and students
            const mentors = await Mentor.find({});
            const students = await Student.find({});
            console.log(`Found ${mentors.length} mentors and ${students.length} students`);

            if (mentors.length === 0 || students.length === 0) {
                return {
                    success: false,
                    message: "No mentors or students found in the database"
                };
            }

            // Separate mentors by seniority
            const seniorMentors = mentors.filter(m => m.seniority === 'S');
            const juniorMentors = mentors.filter(m => m.seniority === 'J');
            console.log(`Senior mentors: ${seniorMentors.length}, Junior mentors: ${juniorMentors.length}`);

            // Create mentor pairs (senior + junior)
            const mentorPairs = [];
            const minPairs = Math.min(seniorMentors.length, juniorMentors.length);
            
            // First, create pairs of senior and junior mentors
            for (let i = 0; i < minPairs; i++) {
                mentorPairs.push({
                    mentors: [seniorMentors[i]._id, juniorMentors[i]._id],
                    mentees: []
                });
                console.log(`Created pair ${i + 1}: Senior ${seniorMentors[i]._id} with Junior ${juniorMentors[i]._id}`);
            }

            // Handle remaining mentors
            const remainingMentors = [
                ...seniorMentors.slice(minPairs),
                ...juniorMentors.slice(minPairs)
            ];
            console.log(`Remaining mentors to pair: ${remainingMentors.length}`);

            // Add remaining mentors in pairs
            for (let i = 0; i < remainingMentors.length; i += 2) {
                if (i + 1 < remainingMentors.length) {
                    mentorPairs.push({
                        mentors: [remainingMentors[i]._id, remainingMentors[i + 1]._id],
                        mentees: []
                    });
                    console.log(`Created pair ${mentorPairs.length}: ${remainingMentors[i]._id} with ${remainingMentors[i + 1]._id}`);
                } else if (mentorPairs.length > 0) {
                    // If there's an odd number of remaining mentors, add to last pair
                    mentorPairs[mentorPairs.length - 1].mentors.push(remainingMentors[i]._id);
                    console.log(`Added remaining mentor ${remainingMentors[i]._id} to last pair`);
                }
            }

            // Calculate students per pair
            const studentsPerPair = Math.floor(students.length / mentorPairs.length);
            const remainingStudents = students.length % mentorPairs.length;
            console.log(`Students per pair: ${studentsPerPair}, Remaining: ${remainingStudents}`);

            // Assign students to mentor pairs
            let currentStudentIndex = 0;
            for (let i = 0; i < mentorPairs.length; i++) {
                const pair = mentorPairs[i];
                const pairSize = studentsPerPair + (i === mentorPairs.length - 1 ? remainingStudents : 0);
                
                // Get students for this pair
                const pairStudents = students.slice(currentStudentIndex, currentStudentIndex + pairSize);
                currentStudentIndex += pairSize;

                console.log(`Assigning ${pairStudents.length} students to pair ${i + 1}`);

                // For each student, assign them to both mentors in the pair
                for (const student of pairStudents) {
                    // Initialize mentoredBy array if it doesn't exist
                    if (!student.mentoredBy) {
                        student.mentoredBy = [];
                    }

                    // Add both mentors to the student's mentoredBy array
                    for (const mentorId of pair.mentors) {
                        if (!student.mentoredBy.includes(mentorId)) {
                            student.mentoredBy.push(mentorId);
                        }
                    }

                    // Save the updated student
                    await student.save();
                    console.log(`Updated student ${student._id} with mentors: ${pair.mentors.join(', ')}`);

                    // Update each mentor's student count
                    for (const mentorId of pair.mentors) {
                        const mentor = await Mentor.findById(mentorId);
                        if (mentor) {
                            mentor.studentCount = await Student.countDocuments({ mentoredBy: mentorId });
                            await mentor.save();
                        }
                    }
                }
            }

            // Verify the updates
            const updatedStudents = await Student.find({});
            console.log("\nVerifying updates:");
            for (const student of updatedStudents) {
                console.log(`Student ${student._id}: ${student.mentoredBy.length} mentors`);
            }

            return {
                success: true,
                message: `Successfully paired ${students.length} students with mentor pairs`
            };
        } catch (error) {
            console.error("Error in autoPairMentorsAndAssignMentees:", error);
            return {
                success: false,
                message: error.message
            };
        }
    }
};
