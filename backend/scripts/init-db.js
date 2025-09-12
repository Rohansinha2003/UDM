const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models to register them with mongoose
require('../models/User');
require('../models/Product');
require('../models/Entry');

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/udm-portal');
    console.log('Connected to MongoDB');

    // Get the database instance
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`Using database: ${dbName}`);

    // Create collections if they don't exist
    const collections = ['users', 'products', 'entries'];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✓ Collection '${collectionName}' created or already exists`);
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`✓ Collection '${collectionName}' already exists`);
        } else {
          console.error(`Error creating collection '${collectionName}':`, error.message);
        }
      }
    }

    // Create indexes for better performance
    console.log('\nCreating indexes...');
    
    // Product indexes
    try {
      await db.collection('products').createIndex({ lot_number: 1 }, { unique: true });
      await db.collection('products').createIndex({ item_type: 1 });
      await db.collection('products').createIndex({ vendor_id: 1 });
      await db.collection('products').createIndex({ status: 1 });
      await db.collection('products').createIndex({ created_by: 1 });
      await db.collection('products').createIndex({ created_at: -1 });
      console.log('✓ Product indexes created');
    } catch (error) {
      console.error('Error creating product indexes:', error.message);
    }

    // Entry indexes
    try {
      await db.collection('entries').createIndex({ product_id: 1 });
      await db.collection('entries').createIndex({ lot_number: 1 });
      await db.collection('entries').createIndex({ item_type: 1 });
      await db.collection('entries').createIndex({ vendor_id: 1 });
      await db.collection('entries').createIndex({ status: 1 });
      await db.collection('entries').createIndex({ entry_type: 1 });
      await db.collection('entries').createIndex({ created_by: 1 });
      await db.collection('entries').createIndex({ created_at: -1 });
      console.log('✓ Entry indexes created');
    } catch (error) {
      console.error('Error creating entry indexes:', error.message);
    }

    // User indexes (if not already created)
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ created_at: -1 });
      console.log('✓ User indexes created');
    } catch (error) {
      console.error('Error creating user indexes:', error.message);
    }

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\nCollections created:');
    console.log('- users (for authentication)');
    console.log('- products (for railway products)');
    console.log('- entries (for product entries)');
    
    console.log('\nIndexes created for optimal performance:');
    console.log('- Product: lot_number (unique), item_type, vendor_id, status, created_by, created_at');
    console.log('- Entry: product_id, lot_number, item_type, vendor_id, status, entry_type, created_by, created_at');
    console.log('- User: email (unique), created_at');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
};

// Run the initialization
initDatabase();
