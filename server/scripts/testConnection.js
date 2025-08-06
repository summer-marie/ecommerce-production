import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function testConnection() {
  console.log('Testing connections...');
  console.log('Local URL:', process.env.MONGODB_URL);
  console.log('Atlas URL available:', !!process.env.MONGODB_ATLAS_URL);
  
  try {
    // Test local connection
    console.log('\nTesting local MongoDB...');
    const localClient = new MongoClient(process.env.MONGODB_URL);
    await localClient.connect();
    const localDb = localClient.db('capstone');
    const collections = await localDb.listCollections().toArray();
    console.log('Local collections:', collections.map(c => c.name));
    
    // Count documents in each collection
    for (const collection of collections) {
      const count = await localDb.collection(collection.name).countDocuments();
      console.log(`  ${collection.name}: ${count} documents`);
    }
    
    await localClient.close();
    console.log('✅ Local connection test successful');
    
    // Test Atlas connection
    console.log('\nTesting Atlas connection...');
    const atlasClient = new MongoClient(process.env.MONGODB_ATLAS_URL);
    await atlasClient.connect();
    console.log('✅ Atlas connection test successful');
    await atlasClient.close();
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();
