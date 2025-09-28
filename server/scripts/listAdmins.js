import 'dotenv/config';
import mongoose from 'mongoose';
import adminModel from '../admins/adminModel.js';
import { getLog } from '../utils/logger.js';

(async () => {
  try {
    const log = getLog(null, { operationId: 'listAdmins' });
    await mongoose.connect(process.env.MONGODB_ATLAS_URL);
    const admins = await adminModel.find({}, { email: 1, firstName: 1, lastName: 1, status: 1, role: 1 }).lean();
    log.info({ event: 'script.listAdmins.start', count: admins.length }, 'Listing admins');
    admins.forEach((u, i) => {
      log.info({ event: 'script.listAdmins.entry', index: i + 1, email: u.email, name: `${u.firstName} ${u.lastName}`, role: u.role, status: u.status });
    });
    log.info({ event: 'script.listAdmins.summary', count: admins.length }, 'Completed listing admins');
  } catch (e) {
    const log = getLog(null, { operationId: 'listAdmins' });
    log.error({ event: 'script.listAdmins.error', err: e && e.message ? e.message : e }, 'Failed to list admins');
  } finally {
    await mongoose.connection.close();
  }
})();
