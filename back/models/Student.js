const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // ✅ Ensures no duplicate emails
    phone: { type: String, required: true },
    course: { type: String, required: true },
    password: { type: String, required: true },
    emailSentDays: { type: Number, default: 0 }
});

module.exports = mongoose.model("Student", StudentSchema);
