import mongoose from "mongoose";
import { getLog } from "./utils/logger.js";

(async () => {
  try {
    const log = getLog(null, { operationId: 'checkMongo' });
    const uri = process.env.MONGODB_ATLAS_URL;
    if (!uri) {
      log.error({ event: 'script.checkMongo.missingEnv' }, 'Missing MONGODB_ATLAS_URL');
      process.exit(1);
    }
    log.info({ event: 'script.checkMongo.start', hostPreview: uri.replace(/^mongodb\+srv:\/\//, '').slice(0, 80) }, 'Attempting MongoDB connection');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    log.info({ event: 'script.checkMongo.connected' }, 'MongoDB connection successful');
    await mongoose.disconnect();
  } catch (e) {
    const log = getLog(null, { operationId: 'checkMongo' });
    log.error({ event: 'script.checkMongo.error', err: e && e.message ? e.message : e }, 'MongoDB connection failed');
    process.exit(1);
  }
})();
