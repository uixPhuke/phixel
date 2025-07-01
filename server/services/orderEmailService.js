const nodemailer = require('nodemailer');
const { param } = require('../routes/userRoutes');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
/**
 * Sends an order confirmation email.
 * @param {string} email - Recipient's email address.
 * @param {Object} order - Order details object.
 */

const sendOrderConfirmationEmail = async (email, order) => {
    if (!email || !order) {
        throw new Error('Email and order details are required');
    }
    const subject = "Order Confirmation - UiX";
    const message = `
        <h2 style="color: whitesmoke;">Thank You for Your Purchase!</h2>
        <p style="color: whitesmoke;">Your order has been successfully placed.</p>
        <h3 style="color: whitesmoke;">Order Details:</h3>
        <ul style="color: whitesmoke;">
            ${order.items.map(item => `
                <li style="color: whitesmoke;">
                    <strong>${item.title}</strong> - ${item.quantity} x ${item.price}
                </li>`).join("")}
        </ul>
        <p style="color: whitesmoke;"><strong>Total Amount:</strong> ${order.totalAmountAfterDelivery}</p>
        <p style="color: whitesmoke;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p style="color: whitesmoke;"><strong>Order ID:</strong> ${order._id}</p>
        <p style="color: whitesmoke;"><strong>Estimated Delivery:</strong> 5-7 business days</p>
        <br/>
        <p style="color: whitesmoke;">For any queries, contact us at <a href="mailto:uixphuke@gmail.com" style="color: whitesmoke;">support@uix.com</a></p>
    `;
    const mailOptions = {
        from: '"UiX" <uixphuke@gmail.com>',
        to: email,
        bcc: 'uixphuke@gmail.com',
        subject,
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #000;
                    color: whitesmoke;
                    display: flex;
                    padding: 20px;
                }
                .container {
                    max-width: 300px;
                    background: #111;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 2px 10px rgba(255, 255, 255, 0.1);
                }
                .header img {
                    max-width: 150px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .content {
                    padding: 10px 0;
                    color: whitesmoke;
                }
                .footer {
                    font-size: 12px;
                    color: whitesmoke;
                    padding-top: 10px;
                }
                .button {
                    display: inline-block;
                    background-color: #d63384;
                    color: whitesmoke;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 15px;
                }
                a {
                    color: whitesmoke;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://i.ibb.co/5TcFNHM/dkraj-Logo-Variant2-White.png" alt="UiX Logo">
                </div>
                <div class="content">
                    ${message}
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
        await transporter.sendMail(mailOptions);
        console.log("Order confirmation email sent successfully.");
    } catch (error) {
        console.error("Error sending order confirmation email:", error.message);
        throw new Error("Failed to send order confirmation email.");
    }
};




const sendOrderCancellationEmail = async (email, order) => {
    if (!email || !order) {
        throw new Error("Email and order details are required.");
    }

    const subject = "Order Cancellation - UiX";
    const message = `
        <h2 style="color: whitesmoke;">Order Cancellation Confirmation</h2>
        <p style="color: whitesmoke;">Your order has been successfully canceled.</p>
        <h3 style="color: whitesmoke;">Order Details:</h3>
        <ul style="color: whitesmoke;">
            ${order.items.map(item => `
                <li style="color: whitesmoke;">
                    <strong>${item.title}</strong> - ${item.quantity} x ${item.price}
                </li>`).join("")}
        </ul>
        <p style="color: whitesmoke;"><strong>Total Amount:</strong> ${order.totalAmountAfterDelivery}</p>
        <p style="color: whitesmoke;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p style="color: whitesmoke;"><strong>Order ID:</strong> ${order._id}</p>
        <br/>
        <p style="color: whitesmoke;">If you have any questions, contact us at <a href="mailto:support@uix.com" style="color: whitesmoke;">support@uix.com</a></p>
    `;

    const mailOptions = {
        from: '"UiX" <uixphuke@gmail.com>',
        to: email,
        bcc: 'uixphuke@gmail.com',
        subject,
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #000;
                    color: whitesmoke;
                    display: flex;
                    padding: 20px;
                }
                .container {
                    max-width: 300px;
                    background: #111;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 2px 10px rgba(255, 255, 255, 0.1);
                }
                .header img {
                    max-width: 150px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .content {
                    padding: 10px 0;
                    color: whitesmoke;
                }
                .footer {
                    font-size: 12px;
                    color: whitesmoke;
                    padding-top: 10px;
                }
                a {
                    color: whitesmoke;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dsn8gtduk/image/upload/v1741380094/uixW_s4qlmn.png" alt="UiX Logo">
                </div>
                <div class="content">
                    ${message}
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
        await transporter.sendMail(mailOptions);
        console.log("Order cancellation email sent successfully.");
    } catch (error) {
        console.error("Error sending order cancellation email:", error.message);
        throw new Error("Failed to send order cancellation email.");
    }
};




 const sendOrderStatusUpdateEmail = async (email, order) => {
    if (!email || !order) {
        throw new Error("Email and order details are required.");
    }

    const subject = `Order Update - UiX (${order.orderStatus.toUpperCase()})`;
    const message = `
        <h2 style="color: whitesmoke;">Your Order Status Has Been Updated</h2>
        <p style="color: whitesmoke;">Your order is now <strong>${order.orderStatus}</strong>.</p>
        <h3 style="color: whitesmoke;">Order Details:</h3>
        <ul style="color: whitesmoke;">
            ${order.items.map(item => `
                <li style="color: whitesmoke;">
                    <strong>${item.title}</strong> - ${item.quantity} x ₹${item.price}
                </li>`).join("")}
        </ul>
        <p style="color: whitesmoke;"><strong>Total Amount:</strong> ₹${order.totalAmountAfterDelivery.toFixed(2)}</p>
        <p style="color: whitesmoke;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p style="color: whitesmoke;"><strong>Order ID:</strong> ${order._id}</p>
        ${order.estimatedDeliveryDate ? `<p style="color: whitesmoke;"><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDeliveryDate).toDateString()}</p>` : ""}
        <br/>
        <p style="color: whitesmoke;">For any queries, contact us at <a href="mailto:support@uix.com" style="color: whitesmoke;">support@uix.com</a></p>
    `;

    const mailOptions = {
        from: '"UiX" <uixphuke@gmail.com>',
        to: email,
        bcc: 'uixphuke@gmail.com',
        subject,
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #000;
                    color: whitesmoke;
                    display: flex;
                    padding: 20px;
                }
                .container {
                    max-width: 300px;
                    background: #111;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 2px 10px rgba(255, 255, 255, 0.1);
                }
                .header img {
                    max-width: 150px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .content {
                    padding: 10px 0;
                    color: whitesmoke;
                }
                .footer {
                    font-size: 12px;
                    color: whitesmoke;
                    padding-top: 10px;
                }
                .button {
                    display: inline-block;
                    background-color: #d63384;
                    color: whitesmoke;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 15px;
                }
                a {
                    color: whitesmoke;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dsn8gtduk/image/upload/v1741380094/uixW_s4qlmn.png" alt="UiX Logo">
                </div>
                <div class="content">
                    ${message}
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
        await transporter.sendMail(mailOptions);
        console.log("Order status update email sent successfully.");
    } catch (error) {
        console.error("Error sending order update email:", error.message);
        throw new Error("Failed to send order status update email.");
    }
};






 const sendReturnRequestEmailToAdmin = async (user, order) => {
    const mailOptions = {
        from: '"UiX" <uixphuke@gmail.com>',
        to: "uixphuke@gmail.com",
        subject: `Return Request - Order ID: ${order._id}`,
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    padding: 20px;
                }
                .container {
                    max-width: 300px;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .content {
                    font-size: 16px;
                    line-height: 1.6;
                }
                .footer {
                    font-size: 14px;
                    margin-top: 20px;
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">New Return Request Received</div>
                <div class="content">
                    <p><strong>User Name:</strong> ${user.name}</p>
                    <p><strong>User Email:</strong> ${user.email}</p>
                    <p><strong>Order ID:</strong> ${order._id}</p>
                    <p><strong>Return Reason:</strong> ${order.returnReason}</p>
                    <p><strong>Return Requested At:</strong> ${new Date(order.returnRequestedAt).toDateString()}</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} UiX</p>
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Return request email sent to admin.");
    } catch (error) {
        console.error("Error sending return request email:", error.message);
    }
};



 const sendReturnStatusEmailToUser = async (user, order) => {
    const mailOptions = {
        from: '"UiX" <uixphuke@gmail.com',
        to: user.email, // User email
        subject: `Return Request ${order.returnStatus.toUpperCase()} - Order ID: ${order._id}`,
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    padding: 20px;
                }
                .container {
                    max-width: 300px;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                }
                .status {
                    font-size: 20px;
                    font-weight: bold;
                    color: ${order.returnStatus === "approved" ? "green" : "red"};
                }
                .content {
                    font-size: 16px;
                    margin-top: 10px;
                }
                .footer {
                    font-size: 14px;
                    margin-top: 20px;
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="status">Your Return Request is ${order.returnStatus.toUpperCase()}</div>
                <div class="content">
                    <p><strong>Order ID:</strong> ${order._id}</p>
                    <p><strong>Return Status:</strong> ${order.returnStatus}</p>
                    ${order.returnStatus === "approved" ? `
                        <p>Your return request has been approved. The refund process will begin shortly.</p>
                        <p><strong>Refund Amount:</strong> ₹${order.totalAmountAfterDelivery}</p>
                    ` : `
                        <p>Unfortunately, your return request has been rejected.</p>
                    `}
                </div>
                <div class="footer">
                    <p>If you have any questions, contact us at <a href="mailto:uixphuke@gmail.com">uixphuke@gmail.com</a></p>
                    <p>&copy; ${new Date().getFullYear()} UiX</p>
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Return status email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending return status email:", error.message);
    }
};



 const sendRefundStatusEmailToUser = async (user, order) => {
    const mailOptions = {
        from: '"UiX" <uixphuke@gmail.com>',
        to: user.email, // User email
        subject: `Refund ${order.refundStatus.toUpperCase()} - Order ID: ${order._id}`,
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    padding: 20px;
                }
                .container {
                    max-width: 300px;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                }
                .status {
                    font-size: 20px;
                    font-weight: bold;
                    color: ${order.refundStatus === "processed" ? "green" : "red"};
                }
                .content {
                    font-size: 16px;
                    margin-top: 10px;
                }
                .footer {
                    font-size: 14px;
                    margin-top: 20px;
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="status">Your Refund is ${order.refundStatus.toUpperCase()}</div>
                <div class="content">
                    <p><strong>Order ID:</strong> ${order._id}</p>
                    <p><strong>Refund Status:</strong> ${order.refundStatus}</p>
                    ${order.refundStatus === "processed" ? `
                        <p>Your refund has been successfully processed.</p>
                        <p><strong>Refund Amount:</strong> ₹${order.refundAmount}</p>
                    ` : `
                        <p>Unfortunately, your refund process has failed.</p>
                        <p>Please contact support for assistance.</p>
                    `}
                </div>
                <div class="footer">
                    <p>If you have any questions, contact us at <a href="mailto:uixphuke@gmail.com">uixphuke@gmail.com</a></p>
                    <p>&copy; ${new Date().getFullYear()} UiX</p>
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Refund status email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending refund status email:", error.message);
    }
};

//export all email service functions
export {
    sendOrderConfirmationEmail,
    sendOrderCancellationEmail,
    sendOrderStatusUpdateEmail,
    sendReturnRequestEmailToAdmin,
    sendReturnStatusEmailToUser,
    sendRefundStatusEmailToUser
};