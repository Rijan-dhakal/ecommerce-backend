import { transporter } from "../config/nodemailer.js";
import { otpTemplate, welcomeTemplate, resetPasswordTemplate } from "./emailTemplates.js";

const sendEmail = async (to, userData, type="otp") => {

  let sub='', htmlContent= '';

  if(type === 'otp') {
    sub = 'OTP For Registration';
    htmlContent = otpTemplate(userData)
  }
  if(type === 'welcome') {
    sub = 'Welcome to E-Commerce!';
    htmlContent = welcomeTemplate(userData);
  }
  if(type === 'resetPassword') {
    sub = 'Reset Password';
    htmlContent = resetPasswordTemplate(userData);
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: sub,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

export default sendEmail;