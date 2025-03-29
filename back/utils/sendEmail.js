const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html // ✅ Sending as HTML instead of plain text
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email Sent to ${to}`);
    } catch (error) {
        console.error("❌ Error Sending Email:", error);
    }
};

module.exports = sendEmail;
