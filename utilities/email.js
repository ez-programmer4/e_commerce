const nodemailer = require('nodemailer');

const sendEmail = async options => {
    console.log('Email configuration:', {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER ? 'Set' : 'Not set',
        pass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
    });

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log('Transporter created successfully');

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
            to: options.email,
            subject: options.subject,
            text: options.message
        };

        console.log('Sending email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Detailed email error:', error);
        throw new Error('Failed to send email: ' + error.message);
    }
};

module.exports = sendEmail;
