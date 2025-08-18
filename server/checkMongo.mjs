import mongoose from 'mongoose';

(async () => {
  try {
    const uri = process.env.MONGODB_ATLAS_URL;
    if (!uri) {
      console.error('CONNECT-ERR Missing MONGODB_ATLAS_URL');
      process.exit(1);
    }
    console.log('Using URI host preview:', uri.replace(/^mongodb\+srv:\/\//, '').slice(0, 100));
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('CONNECTED');
    await mongoose.disconnect();
  } catch (e) {
    console.error('CONNECT-ERR', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
