import nodemailer from 'nodemailer';

/**
 * Sends an email using Gmail SMTP.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text email body.
 * @param {string} html - HTML email body (optional).
 */
export default async function sendEmail({ to, subject, text, html }) {
  try {
    // Configure the transporter with Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // Your Gmail password or App Password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.GMAIL_USER, // Sender address
      to,
      subject,
      text,
      html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
