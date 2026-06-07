import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function testConnection() {
  console.log('--- Email Debugger ---');
  console.log('User:', process.env.EMAIL_USER);
  console.log('Pass:', process.env.EMAIL_PASS ? '******** (Hidden)' : 'MISSING');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection successful!');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self
      subject: 'VaizAI Test Email',
      text: 'If you see this, your email configuration is working correctly!'
    };

    console.log('Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error occurred:');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n--- TROUBLESHOOTING ---');
      console.log('1. Ensure "2-Step Verification" is ON in your Google Account.');
      console.log('2. Ensure you are using a 16-character "App Password", NOT your regular password.');
      console.log('3. Check if your App Password has expired or been deleted.');
    }
  }
}

testConnection();
