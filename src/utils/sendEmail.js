import { transporter } from "../config/nodemailer.js";
import { generateTemplate } from "./emailTemplates.js";

const sendEmail = async (to, userData) => {
  const htmlContent = generateTemplate(userData);

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: 'Test Email',
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