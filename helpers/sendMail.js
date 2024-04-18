const nodemailer = require('nodemailer');
const env = require('dotenv').config();

const mail = process.env.SMTP_MAIL;
const password = process.env.SMTP_PASSWORD;
const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const secure = process.env.SMTP_SECURE === 'true';

const sendMail = (email, subject, content) => {
    return new Promise((resolve, reject) => {
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
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`Mail successfully sent to: ${email}, from: ${mail}.`);
                    resolve({ status: 200, message: `Mail successfully sent to: ${email}, from: ${mail}` });
                }
            });
        } catch (error) {
            console.error(error.message);
            reject(error);
        }
    });
};

module.exports = sendMail;
