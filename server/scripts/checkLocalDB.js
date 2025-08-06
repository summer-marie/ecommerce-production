import mongoose from 'mongoose';

async function checkLocalDatabase() {
    try {
        // Connect to local capstone database
        await mongoose.connect('mongodb://localhost:27017/capstone');
        console.log('✅ Connected to local capstone database');
        
        // Get all collection names
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📋 Collections in capstone database:');
        collections.forEach(collection => {
            console.log(`  - ${collection.name}`);
        });
        
        // Count documents in each collection
        console.log('\n📊 Document counts:');
        for (const collection of collections) {
            const count = await mongoose.connection.db.collection(collection.name).countDocuments();
            console.log(`  - ${collection.name}: ${count} documents`);
        }
        
        await mongoose.connection.close();
        console.log('\n✅ Database check complete');
    } catch (error) {
        console.error('❌ Error checking database:', error.message);
    }
}

checkLocalDatabase();
