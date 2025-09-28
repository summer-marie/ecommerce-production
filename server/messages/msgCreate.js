import messageModel from "./msgModel.js";
import sgMail from "@sendgrid/mail";
import { getLog } from "../utils/logger.js";
import {
  checkMessageLimit,
  cleanupOldMessages,
  cleanupOldestMessages,
} from "../utils/messageCleanup.js";

// Environment-driven behavior:
// - If SAVE_CONTACTS is 'true' (default), messages are saved to DB.
// - If SAVE_CONTACTS is 'false', messages will not be persisted and will only be emailed.
const shouldSave =
  (process.env.SAVE_CONTACTS || "true").toLowerCase() === "true";

// Configure SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const messageCreate = async (req, res) => {
  try {
  const log = getLog(req, { event: 'message.create' });
  log.debug({ bodyKeys: Object.keys(req.body || {}) }, 'received message data');

    const { email, subject, message } = req.body || {};

    if (!email || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Build email
    const to = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL;
    const from =
      process.env.CONTACT_FROM_EMAIL ||
      process.env.SENDGRID_FROM_EMAIL ||
      "noreply@yoursite.com";

    const mailOptions = {
      from,
      to,
      subject: `Website contact: ${subject}`,
      text: `From: ${email}\n\n${message}`,
      html: `<p><strong>From:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><hr/><div>${message}</div>`,
    };

    // Attempt to send email via SendGrid
    let mailResult = null;
    if (process.env.SENDGRID_API_KEY) {
      try {
        const result = await sgMail.send(mailOptions);
        mailResult = {
          messageId: result[0]?.headers?.["x-message-id"] || "sent",
        };
  log.info({ messageId: mailResult.messageId }, 'contact email sent via sendgrid');
      } catch (err) {
        log.error({ err: err?.message || err }, 'failed to send contact email via sendgrid');
      }
    } else {
      log.warn('sendgrid api key not configured; skipping email send');
    }

    // Optionally save to DB with cleanup and limits
    let saved = null;
    let limitInfo = null;

    if (shouldSave) {
      try {
        // First, run automatic cleanup of old messages
        await cleanupOldMessages();

        // Check current message limits
        limitInfo = await checkMessageLimit();

        // If at limit, remove oldest messages to make room
        if (limitInfo.limitReached) {
          await cleanupOldestMessages(1);
          log.info('message limit reached; removed oldest message');
        }

        // Save the new message
        saved = await messageModel.create({ email, subject, message });
  log.info('message saved to database');
      } catch (err) {
  log.error({ err: err?.message || err }, 'failed to save contact message');
      }
    }

    // If neither email nor DB saved, return error
    if (!mailResult && !saved) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to deliver or save message" });
    }

    return res.status(201).json({
      success: true,
      message: "Message delivered",
      emailResult: mailResult ? { messageId: mailResult.messageId } : null,
      saved: saved ? saved.toJSON() : null,
    });
  } catch (error) {
  const log = getLog(req, { event: 'message.create.error' });
  log.error({ err: error?.message, stack: error?.stack }, 'message create handler error');
    return res
      .status(500)
      .json({ success: false, error: "Server error while processing message" });
  }
};

export default messageCreate;
