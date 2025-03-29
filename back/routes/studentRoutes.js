const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const cron = require("node-cron");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const emailTemplates = require("../utils/emails");

// ✅ Register Student and Start Email Sequence
router.post("/register", async (req, res) => {
    try {
        const { username, email, phone, course, password } = req.body;
       const existingUser = await Student.findOne({ email });
        if (existingUser) {
           return res.status(400).json({ message: "Email already registered!" });
       }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({ 
            username, 
            email, 
            phone, 
            course, 
            password: hashedPassword,
            emailSentDays: 0
        });

        await student.save();

        // ✅ 1️⃣ Send the immediate confirmation email
        await sendEmail(email, "Course Registration", `Hello ${username},\n\nWelcome to the ${course} course!`);
        console.log(`✅ Confirmation Email Sent to ${email}`);

        // ✅ 2️⃣ Schedule the 10-minute email sequence
        scheduleEmails(email, username);

        res.json({ message: "Registration successful! You will receive 10 emails in 10 minutes." });

    } catch (error) {
        res.status(500).json({ message: "Error registering student" });
    }
});

// ✅ Add scheduleEmails Function Here (Below register route)
const scheduleEmails = (email, username) => {
    let count = 0;
    
    const task = cron.schedule("* * * * *", async () => {  // Runs every minute
        if (count >= 10) {
            console.log(`🛑 Stopping emails for ${email}`);
            task.stop();
            return;
        }

        try {
            const student = await Student.findOne({ email });
            if (!student) {
                console.error(`❌ Student not found: ${email}`);
                task.stop();
                return;
            }

            const day = student.emailSentDays || 0;
            if (day >= emailTemplates.length) {
                console.log(`✅ All emails sent for ${email}`);
                task.stop();
                return;
            }

            // Fetch the correct EJS template
            const emailContent = emailTemplates[day];
            const templatePath = path.join(__dirname, "../templates/emailtemplate", emailContent.template);

            if (!fs.existsSync(templatePath)) {
                console.error(`❌ Template not found: ${templatePath}`);
                task.stop();
                return;
            }

            // Render the EJS template
            const template = fs.readFileSync(templatePath, "utf-8");
            const html = ejs.render(template, { studentName: username });

            // Send the email
            await sendEmail(email, emailContent.subject, html);
            console.log(`✅ Email ${day + 1} sent to ${email}`);

            // Update student record
            student.emailSentDays += 1;
            await student.save();
            count++;

        } catch (error) {
            console.error("❌ Error sending emails:", error);
            task.stop();
        }
    });

    console.log(`⏳ Email sequence started for ${email}`);
};

module.exports = router;
