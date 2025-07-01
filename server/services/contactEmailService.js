const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

 const sendContactEmail = async ({ name, email, phone, message }) => {
    const mailOptions = {
        from: `"UiX" <${process.env.EMAIL}>`,
        to: "uixphuke@gmail.com",
        subject: "New Contact Form Submission",
        html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phone}</p>
        
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Failed to send contact email:", error);
        throw new Error("Email service failed. Please try again later.");
    }
};

//export all email service functions
export {
    sendContactEmail
};