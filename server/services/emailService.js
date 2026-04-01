const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = null;

// Initialize transporter safely
const initTransporter = () => {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // required for port 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    console.log("Email transporter initialized.");
    return transporter;
};

const sendOtpEmail = async (email, otp, type = "verification") => {
    if (!email || !otp) {
        throw new Error("Email and OTP are required to send an email.");
    }

    let subject, message;

    if (type === "verification") {
        subject = "Your OTP for Account Verification";
        message = `
            <h2>Your OTP for Account Verification</h2>
            <p>Please use the OTP below to verify your account</p>
        `;
    } else if (type === "forgot-password") {
        subject = "Your OTP for Password Recovery";
        message = `
            <h2>Your OTP for Password Recovery</h2>
            <p>Please use the OTP below to reset your password</p>
        `;
    } else {
        throw new Error("Invalid email type specified.");
    }

    const mailOptions = {
        from: '"UiX" <uixphuke@gmail.com>',
        to: email,
        subject,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #000000;
                    color: #ffffff;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #1a1a1a;
                    border: 1px solid #333333;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #ffffff;
                }
                .header img {
                    max-width: 100px;
                }
                .content {
                    text-align: center;
                    line-height: 1.6;
                    color: #ffffff;
                }
                .otp {
                    font-size: 20px;
                    font-weight: bold;
                    color: #cccccc;
                    margin: 10px 0;
                }
                .footer {
                    margin-top: 24px;
                    font-size: 12px;
                    color: #bbbbbb;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dsn8gtduk/image/upload/v1751398709/logo_ginh5d.png" alt="Uix Logo">
                </div>
                <div class="content">
                    ${message}
                    <p class="otp">${otp}</p>
                    <p>This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} UiX. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        const transporterInstance = initTransporter();
        const info = await transporterInstance.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("Email sending failed:", error.message);

        if (error.message.includes("ETIMEDOUT")) {
            throw new Error(
                "Email server timeout. Render free plan may block SMTP. Consider using Resend or SendGrid."
            );
        }

        throw new Error("Failed to send email. Please try again later.");
    }
};

module.exports = {
    sendOtpEmail,
};
