import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const accountEmail = process.env.MAIL_USER;

const emailPassword = process.env.EMAIL_PASSWORD;
if (!emailPassword) {
  console.warn('password environment variable is not set');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: accountEmail,
    pass: emailPassword
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('Server connection error:', error);
  } else {
    console.log('Mail service started');
  }
});

export {transporter};