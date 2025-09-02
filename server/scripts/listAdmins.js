import 'dotenv/config';
import mongoose from 'mongoose';
import adminModel from '../admins/adminModel.js';

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URL);
    const admins = await adminModel.find({}, { email: 1, firstName: 1, lastName: 1, status: 1, role: 1 }).lean();
    console.log('\nAdmins in database:', admins.length);
    admins.forEach((u, i) => console.log(`${i + 1}. ${u.email} (${u.firstName} ${u.lastName}) [${u.role}/${u.status}]`));
  } catch (e) {
    console.error('Failed to list admins:', e);
  } finally {
    await mongoose.connection.close();
  }
})();
