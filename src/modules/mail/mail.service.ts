import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MailData {
  [key: string]: any;
}


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendEmail = async (to: string, subject: string, templateName: string, data: MailData, attachments: any[] = []) => {
  try {
    const templatePath = path.join(__dirname, `../../templates/${templateName}.ejs`);
    
    const html = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: `"TechFest Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to: ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending to ${to}:`, error);
    return false;
  }
};