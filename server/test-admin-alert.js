import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { sendAdminNewOrderEmail } from './utils/orderAlertService.js';

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
  try {
    const result = await sendAdminNewOrderEmail(mockOrder);
    console.log('Admin alert send result:', result);
  } catch (err) {
    console.error('Admin alert send failed:', err);
    process.exit(1);
  }
})();
