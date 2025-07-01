const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;
try {
    transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.verify();
} catch (error) {
    throw new Error(
        "Failed to configure email transporter. Please check your credentials."
    );
}

const sendOtpEmail = async (email, otp, type = "verification") => {
    if (!email || !otp) {
        throw new Error("Hi ,Email and OTP are required to send an email.");
    }

    let subject, message;
    if (type === "verification") {
        subject = "Your OTP for Account Verification";
        message = `
        <h2>Your OTP for Account Verification</h2>
        <p>Please use the OTP below to verify your account:</p>
        `;
    } else if (type === "forgot-password") {
        subject = "Your OTP for Password Recovery";
        message = `
        <h2>Your OTP for Password Recovery</h2>
        <p>Please use the OTP below to reset your password:</p>
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
                background-color: #000000; /* Black background */
                color: #ffffff; /* White text */
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: #1a1a1a; /* Darker shade for email container */
                border: 1px solid #333333; /* Subtle border */
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1); /* Subtle white glow */
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
                color: #ffffff; /* White text */
            }
            .header img {
                max-width: 150px;
            }
            .content {
                text-align: center;
                line-height: 1.6;
                color: #ffffff; /* Ensure content text is white */
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #d63384; /* Highlight the OTP in a vibrant color */
                margin: 10px 0;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #bbbbbb; /* Lighter gray for footer text */
                text-align: center;
            }
        </style>
        </head>
        <body>
            <div class="email-container">
            <div class="header">
                <img src="https://res.cloudinary.com/dsn8gtduk/image/upload/v1741380094/uixW_s4qlmn.png" alt="Uix Logo Logo">
            </div>
            <div class="content">
                ${message}
                <p class="otp">${otp}</p>
                <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} UiX JEWELS. All rights reserved.</p>
            </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        if (error.responseCode === 550) {
            console.error("Authentication Error: Invalid email credentials.");
        } else if (error.message.includes("ENOTFOUND")) {
            console.error("Network Error: Unable to connect to the email server.");
        } else if (error.message.includes("ETIMEDOUT")) {
            console.error(
                "Timeout Error: Email server is taking too long to respond."
            );
        } else if (error.message.includes("ECONNREFUSED")) {
            console.error("Connection Error: Email server refused the connection.");
        } else {
            console.error("Unexpected Error:", error.message);
        }
        throw new Error("Failed to send email. Please try again later.");
    }
};


//export
module.exports = {
    sendOtpEmail,
};