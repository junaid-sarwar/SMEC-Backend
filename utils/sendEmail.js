// utils/sendMail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Ya koi aur SMTP
      auth: {
        user: process.env.EMAIL_USER, // Admin email
        pass: process.env.EMAIL_PASS, // App password (Not normal password)
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text, // HTML bhi use kar sakte ho for better design
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.log('Email sending failed:', error);
  }
};

module.exports = sendEmail;