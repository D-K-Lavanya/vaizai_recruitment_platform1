import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configure the email transporter
 * Priority: .env credentials > Placeholder
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

/**
 * Sends an application confirmation email to the candidate
 * @param {string} to - Candidate's email address
 * @param {string} name - Candidate's name
 * @param {string} jobTitle - The job they applied for
 */
export const sendApplicationConfirmation = async (to, name, jobTitle) => {
  const mailOptions = {
    from: `"VaizAI Recruitment" <${process.env.EMAIL_USER || 'noreply@vaizai.com'}>`,
    to,
    subject: `Application Received: ${jobTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #10b981;">Application Received!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for applying for the <strong>${jobTitle}</strong> position at our partner company.</p>
        <p>Our AI-powered screening engine is currently reviewing your profile and resume. You will receive an update once the recruiter has reviewed your application.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">This is an automated notification from the VaizAI Recruitment Platform.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent: %s', info.messageId);
    if (transporter.options.host === 'smtp.ethereal.email') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

/**
 * Sends a status update notification to the candidate
 * @param {string} to - Candidate's email address
 * @param {string} name - Candidate's name
 * @param {string} newStatus - The updated status (Shortlisted, Interview, etc.)
 */
export const sendStatusUpdate = async (to, name, newStatus) => {
  const mailOptions = {
    from: `"VaizAI Recruitment" <${process.env.EMAIL_USER || 'noreply@vaizai.com'}>`,
    to,
    subject: `Status Update: Your application has been updated to ${newStatus}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #10b981;">Status Update</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your application status has been updated to: <span style="font-weight: bold; color: #10b981;">${newStatus}</span></p>
        <p>A recruiter will be in touch with you shortly regarding the next steps in the process.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">VaizAI Recruitment Platform - Empowering Careers through Intelligence.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Status update email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
};

const formatInterviewDate = (date) => {
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Sends an interview invitation email
 * @param {string} to - Candidate's email address
 * @param {string} name - Candidate's name
 * @param {Date} scheduledAt - Time of the interview
 * @param {string} roomLink - The meeting room link (Google Meet/Zoom)
 */
export const sendInterviewInvite = async (to, name, scheduledAt, roomLink) => {
  const mailOptions = {
    from: `"VaizAI Recruitment" <${process.env.EMAIL_USER || 'noreply@vaizai.com'}>`,
    to,
    subject: `Interview Invitation: VaizAI Platform`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #10b981;">Interview Scheduled!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your interview has been scheduled for: <span style="font-weight: bold; color: #10b981;">${formatInterviewDate(scheduledAt)}</span></p>
        
        ${roomLink ? `
          <div style="margin: 30px 0;">
            <p>You can join the interview session by clicking the button below:</p>
            <a href="${roomLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Join Meeting Room</a>
          </div>
        ` : '<p>The meeting link will be shared with you shortly.</p>'}
        
        <p>Please ensure you have a stable internet connection and be ready for the call.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">VaizAI - Recruitment Redefined.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Interview invite sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending interview invite:', error);
  }
};

const emailService = {
  sendApplicationConfirmation,
  sendStatusUpdate,
  sendInterviewInvite
};

export default emailService;