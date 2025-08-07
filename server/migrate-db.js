// Database Migration Script - Copy from capstone to pizza-database
import "dotenv/config";
import mongoose from "mongoose";

const oldDbUrl =
  "mongodb+srv://summerhalsey0318:A1EfPyfzzVeK6RXj@pizza-production-cluste.ucnhbla.mongodb.net/capstone?retryWrites=true&w=majority&appName=pizza-production-cluster";
const newDbUrl =
  "mongodb+srv://summerhalsey0318:A1EfPyfzzVeK6RXj@pizza-production-cluste.ucnhbla.mongodb.net/pizza-database?retryWrites=true&w=majority&appName=pizza-production-cluster";

async function migrateDatabase() {
  try {
    // Connect to old database
    const oldConnection = await mongoose.createConnection(oldDbUrl);
    console.log("✅ Connected to old database (capstone)");

    // Connect to new database
    const newConnection = await mongoose.createConnection(newDbUrl);
    console.log("✅ Connected to new database (pizza-database)");

    // Wait for connections to be ready
    await new Promise((resolve) => {
      if (oldConnection.readyState === 1) resolve();
      else oldConnection.once('connected', resolve);
    });
    
    await new Promise((resolve) => {
      if (newConnection.readyState === 1) resolve();
      else newConnection.once('connected', resolve);
    });

    // Define specific collections to migrate (excluding users)
    const collectionsToMigrate = ['builders', 'ingredients', 'messages', 'orders'];
    console.log("📋 Collections to migrate:", collectionsToMigrate);

    // Copy each specified collection
    for (const collectionName of collectionsToMigrate) {
      console.log(`🔄 Copying collection: ${collectionName}`);

      try {
        // Get all documents from old collection
        const oldCollection = oldConnection.collection(collectionName);
        const documents = await oldCollection.find({}).toArray();

        if (documents.length > 0) {
          // Insert into new collection
          const newCollection = newConnection.collection(collectionName);
          await newCollection.insertMany(documents);
          console.log(
            `✅ Copied ${documents.length} documents to ${collectionName}`
          );
        } else {
          console.log(`⚠️  No documents found in ${collectionName}`);
        }
      } catch (collectionError) {
        console.log(`⚠️  Collection ${collectionName} may not exist in source database`);
      }
    }

    console.log("🎉 Migration completed successfully!");
    console.log(
      "💡 You can now update your connection string to use pizza-database"
    );

    await oldConnection.close();
    await newConnection.close();
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

// Run migration
migrateDatabase();
