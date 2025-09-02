import 'dotenv/config';
import mongoose from 'mongoose';
import * as argon2 from 'argon2';
import adminModel from '../admins/adminModel.js';

// Usage:
// EMAIL=user@example.com NEW_PASSWORD='StrongPass123' node scripts/resetAdminPassword.js
// Or: node scripts/resetAdminPassword.js user@example.com StrongPass123

const emailArg = process.argv[2];
const passArg = process.argv[3];
const EMAIL = (process.env.EMAIL || emailArg || '').trim().toLowerCase();
const NEW_PASSWORD = process.env.NEW_PASSWORD || passArg || '';

if (!EMAIL || !NEW_PASSWORD) {
  console.error('Usage: EMAIL=<email> NEW_PASSWORD=<password> node scripts/resetAdminPassword.js');
  console.error('   or: node scripts/resetAdminPassword.js <email> <password>');
  process.exit(1);
}

(async () => {
  try {
    if (!process.env.MONGODB_ATLAS_URL) {
      throw new Error('MONGODB_ATLAS_URL is not set');
    }
    await mongoose.connect(process.env.MONGODB_ATLAS_URL);

    const user = await adminModel.findOne({ email: EMAIL });
    if (!user) {
      console.error('No admin found with email:', EMAIL);
      process.exit(2);
    }

    user.password = await argon2.hash(NEW_PASSWORD);
    // Optional: clear tokens so all sessions are invalidated
    user.token = [];
    await user.save();

    console.log('Password reset successfully for:', EMAIL);
  } catch (e) {
    console.error('Failed to reset admin password:', e.message);
    process.exit(3);
  } finally {
    await mongoose.connection.close();
  }
})();
