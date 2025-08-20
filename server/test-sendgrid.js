import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Test SendGrid configuration
const testSendGrid = async () => {
  try {
    console.log("Testing SendGrid configuration...");
    console.log("API Key exists:", !!process.env.SENDGRID_API_KEY);
    console.log("API Key prefix:", process.env.SENDGRID_API_KEY?.substring(0, 10) + "...");
    
    // Set API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: process.env.CONTACT_TO_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'SendGrid Test Email',
      text: 'This is a test email from your pizza app contact form setup.',
      html: '<p>This is a <strong>test email</strong> from your pizza app contact form setup.</p>',
    };
    
    console.log("Attempting to send test email...");
    console.log("To:", msg.to);
    console.log("From:", msg.from);
    
    const result = await sgMail.send(msg);
    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", result[0]?.headers?.['x-message-id']);
    
  } catch (error) {
    console.error("❌ SendGrid test failed:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
  }
};

testSendGrid();
