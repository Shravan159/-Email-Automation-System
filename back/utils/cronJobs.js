const cron = require("node-cron");
const Student = require("../models/Student");
const sendEmail = require("./sendEmail");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const emailTemplates = require("./emails");

const sendEmails = async () => {
    try {
        const students = await Student.find();

        for (const student of students) {
            const day = student.emailSentDays || 0; // Get last sent email index

            if (day >= emailTemplates.length) continue; // Stop after 10 emails

            const emailContent = emailTemplates[day];
            const templatePath = path.join(__dirname, "../templates", emailContent.template);

            if (!fs.existsSync(templatePath)) {
                console.error(`❌ Template not found: ${templatePath}`);
                continue;
            }

            // Render the EJS template
            const template = fs.readFileSync(templatePath, "utf-8");
            const html = ejs.render(template, { studentName: student.username });

            // Send the email
            await sendEmail(student.email, emailContent.subject, html);
            console.log(`✅ Email ${day + 1} sent to ${student.email}`);

            // Update student record
            student.emailSentDays += 1;
            await student.save();
        }
    } catch (error) {
        console.error("❌ Error sending emails:", error);
    }
};

// Schedule the job to run **every minute** for 10 minutes
let count = 0;
const task = cron.schedule("* * * * *", async () => {
    if (count < 10) {
        await sendEmails();
        count++;
    } else {
        console.log("🛑 Stopping email cron job after 10 minutes...");
        task.stop();
    }
});

console.log("✅ 10-minute email cron job scheduled...");
