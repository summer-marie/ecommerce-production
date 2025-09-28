import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { sendAdminNewOrderEmail } from './utils/orderAlertService.js';
import { getLog } from './utils/logger.js';

// Load server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const mockOrder = {
  orderNumber: '100123',
  date: new Date().toISOString(),
  firstName: 'Test',
  lastName: 'Customer',
  phone: '(555) 123-4567',
  email: 'test@example.com',
  orderTotal: 29.97,
  orderDetails: [
    { pizzaName: 'Margherita', quantity: 1, pizzaPrice: 9.99 },
    { pizzaName: 'Pepperoni', quantity: 2, pizzaPrice: 9.99 },
  ],
};

(async () => {
  const log = getLog(null, { operationId: 'testAdminAlert' });
  try {
    const result = await sendAdminNewOrderEmail(mockOrder);
    log.info({ event: 'test.adminAlert.success', recipients: result && result.recipients ? result.recipients.length : undefined }, 'Admin alert send result');
  } catch (err) {
    log.error({ event: 'test.adminAlert.error', err: err && err.message ? err.message : err }, 'Admin alert send failed');
    process.exit(1);
  }
})();
