import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import { getLog } from './logger.js';

// Load server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

(async () => {
  try {
    const log = getLog(null, { operationId: 'testSendEmail' });
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY not set');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) throw new Error('No CONTACT_TO_EMAIL configured');

    const result = await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@overthewallpizza.com',
      subject: 'Test Admin Alert (SendGrid)',
      text: 'This is a SendGrid test message for admin alerts.',
      html: '<strong>This is a SendGrid test message for admin alerts.</strong>',
    });
    log.info({ event: 'test.email.success', messageId: result[0]?.headers?.['x-message-id'] || 'ok', to }, 'Test email sent');
  } catch (error) {
    const log = getLog(null, { operationId: 'testSendEmail' });
    log.error({ event: 'test.email.error', err: error && error.message ? error.message : error }, 'Failed to send test email');
  }
})();
