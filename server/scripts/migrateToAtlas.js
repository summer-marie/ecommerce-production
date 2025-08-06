import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function migrateToAtlas() {
  let sourceClient, targetClient;
  
  try {
    console.log('🚀 Starting migration from local capstone database to Atlas...');
    
    // Connect to source (local MongoDB)
    console.log('📡 Connecting to local MongoDB...');
    sourceClient = new MongoClient(process.env.MONGODB_URL);
    await sourceClient.connect();
    const sourceDb = sourceClient.db('capstone');
    console.log('✅ Connected to local MongoDB');
    
    // Connect to target (Atlas)
    console.log('☁️ Connecting to MongoDB Atlas...');
    targetClient = new MongoClient(process.env.MONGODB_ATLAS_URL);
    await targetClient.connect();
    const targetDb = targetClient.db('capstone'); // Keep same database name
    console.log('✅ Connected to Atlas');
    
    // Collections to migrate
    const collections = ['orders', 'users', 'builders', 'ingredients', 'messages'];
    
    console.log('🔄 Starting data migration...');
    
    for (const collectionName of collections) {
      try {
        console.log(`\n📦 Migrating ${collectionName}...`);
        
        // Get all documents from source
        const sourceCollection = sourceDb.collection(collectionName);
        const documents = await sourceCollection.find({}).toArray();
        
        console.log(`   Found ${documents.length} documents in local ${collectionName}`);
        
        if (documents.length === 0) {
          console.log(`   ⚠️ No documents found in ${collectionName}`);
          continue;
        }
        
        // Insert into target
        const targetCollection = targetDb.collection(collectionName);
        
        // Clear target collection first (in case of re-migration)
        await targetCollection.deleteMany({});
        console.log(`   🗑️ Cleared existing data in Atlas ${collectionName}`);
        
        // Insert all documents
        const result = await targetCollection.insertMany(documents);
        console.log(`   ✅ Migrated ${result.insertedCount} documents to ${collectionName}`);
        
      } catch (error) {
        console.error(`   ❌ Error migrating ${collectionName}:`, error.message);
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('📊 Summary:');
    
    // Verify migration by counting documents
    for (const collectionName of collections) {
      try {
        const targetCollection = targetDb.collection(collectionName);
        const count = await targetCollection.countDocuments();
        console.log(`   ${collectionName}: ${count} documents`);
      } catch (error) {
        console.log(`   ${collectionName}: Error counting documents`);
      }
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  } finally {
    // Close connections
    if (sourceClient) {
      await sourceClient.close();
      console.log('🔌 Disconnected from local MongoDB');
    }
    if (targetClient) {
      await targetClient.close();
      console.log('🔌 Disconnected from Atlas');
    }
  }
}

// Run migration
migrateToAtlas();
