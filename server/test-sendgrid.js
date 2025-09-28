import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { getLog } from "./utils/logger.js";

// Load environment variables
dotenv.config();

// Test SendGrid configuration
const testSendGrid = async () => {
  try {
    const log = getLog(null, { operationId: 'testSendGrid' });
    log.info({ event: 'test.sendgrid.start', apiKeyExists: !!process.env.SENDGRID_API_KEY }, 'Testing SendGrid configuration');
    if (process.env.SENDGRID_API_KEY) {
      log.debug({ event: 'test.sendgrid.keyPreview', prefix: process.env.SENDGRID_API_KEY.substring(0, 6) }, 'API key preview');
    }

    // Set API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: process.env.CONTACT_TO_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "SendGrid Test Email",
      text: "This is a test email from your pizza app contact form setup.",
      html: "<p>This is a <strong>test email</strong> from your pizza app contact form setup.</p>",
    };

  log.info({ event: 'test.sendgrid.attempt', to: msg.to, from: msg.from }, 'Attempting to send test email');

    const result = await sgMail.send(msg);
    log.info({ event: 'test.sendgrid.success', messageId: result[0]?.headers?.['x-message-id'] }, 'Test email sent');
  } catch (error) {
    const log = getLog(null, { operationId: 'testSendGrid' });
    log.error({ event: 'test.sendgrid.error', message: error.message, code: error.code, err: error }, 'SendGrid test failed');
  }
};

testSendGrid();
