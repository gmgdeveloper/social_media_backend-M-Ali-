const nodemailer = require('nodemailer');
const env = require('dotenv').config();

const mail = process.env.SMTP_MAIL;
const password = process.env.SMTP_PASSWORD;
const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const secure = process.env.SMTP_SECURE === 'true';

const sendMail = async (email, subject, content) => {
    try {
        const transport = nodemailer.createTransport({
            host: host,
            port: parseInt(port),
            secure: secure,
            requireTLS: true,
            auth: {
                user: mail,
                pass: password
            }
        });

        const mailOptions = {
            from: mail,
            to: email,
            subject: subject,
            html: content
        };

        transport.sendMail(mailOptions, (err, res) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log(`Mail successfully sent to: ${email}, from: ${mail}. More info: ${res.response}`);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = sendMail;
