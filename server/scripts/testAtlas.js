import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function testAtlasData() {
  try {
    console.log('🧪 Testing Atlas database connection and data...');
    
    const client = new MongoClient(process.env.MONGODB_URL);
    await client.connect();
    const db = client.db('capstone');
    
    console.log('✅ Connected to Atlas successfully!');
    
    // Test each collection
    const collections = ['orders', 'users', 'builders', 'ingredients', 'messages'];
    
    console.log('\n📊 Data verification:');
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      console.log(`   ${collectionName}: ${count} documents`);
      
      // Show a sample document from orders
      if (collectionName === 'orders' && count > 0) {
        const sample = await collection.findOne({});
        console.log(`   Sample order ID: ${sample._id}`);
      }
    }
    
    await client.close();
    console.log('\n🎉 Atlas database test successful! Your pizza app data is ready in the cloud.');
    
  } catch (error) {
    console.error('❌ Atlas test failed:', error.message);
  }
}

testAtlasData();
