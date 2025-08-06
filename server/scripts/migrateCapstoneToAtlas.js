import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const LOCAL_DB_URL = 'mongodb://localhost:27017/capstone';  // Your local capstone database
const ATLAS_DB_URL = process.env.MONGODB_ATLAS_URL;

async function migrateToAtlas() {
    let localConnection, atlasConnection;
    
    try {
        console.log('🚀 Starting migration from capstone database to MongoDB Atlas...\n');
        
        if (!ATLAS_DB_URL) {
            console.error('❌ MONGODB_ATLAS_URL not found in .env file');
            return;
        }
        
        // Connect to local MongoDB (capstone database)
        console.log('📡 Connecting to local MongoDB (capstone)...');
        localConnection = await mongoose.createConnection(LOCAL_DB_URL);
        console.log('✅ Connected to local capstone database');
        
        // Connect to MongoDB Atlas
        console.log('📡 Connecting to MongoDB Atlas...');
        atlasConnection = await mongoose.createConnection(ATLAS_DB_URL);
        console.log('✅ Connected to MongoDB Atlas');
        
        // Collections to migrate (exactly what we found in your capstone database)
        const collections = ['orders', 'messages', 'users', 'ingredients', 'builders'];
        
        for (const collectionName of collections) {
            console.log(`\n📦 Migrating ${collectionName}...`);
            
            // Get data from local database
            const localData = await localConnection.db.collection(collectionName).find({}).toArray();
            console.log(`   Found ${localData.length} documents in local ${collectionName}`);
            
            if (localData.length > 0) {
                // Clear existing data in Atlas (if any)
                await atlasConnection.db.collection(collectionName).deleteMany({});
                
                // Insert data into Atlas
                await atlasConnection.db.collection(collectionName).insertMany(localData);
                console.log(`   ✅ Migrated ${localData.length} ${collectionName} to Atlas`);
            } else {
                console.log(`   ⚠️  No data found in ${collectionName}`);
            }
        }
        
        console.log('\n🎉 Migration completed successfully!');
        console.log('\n📊 Summary:');
        
        // Verify migration by counting documents in Atlas
        for (const collectionName of collections) {
            const count = await atlasConnection.db.collection(collectionName).countDocuments();
            console.log(`   ${collectionName}: ${count} documents`);
        }
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        // Close connections
        if (localConnection) {
            await localConnection.close();
            console.log('\n📡 Closed local database connection');
        }
        if (atlasConnection) {
            await atlasConnection.close();
            console.log('📡 Closed Atlas database connection');
        }
    }
}

// Run migration
migrateToAtlas()
    .then(() => {
        console.log('\n✅ Migration script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Migration script failed:', error);
        process.exit(1);
    });
