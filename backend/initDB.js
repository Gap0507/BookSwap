const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { User, Book, Transaction } = require('./models');

const initDB = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Get the list of all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nCurrent collections in database:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });

        // Log the registered models
        console.log('\nRegistered Mongoose models:');
        Object.keys(mongoose.models).forEach(modelName => {
            const model = mongoose.models[modelName];
            console.log(`- ${modelName}`);
            console.log('  Schema:', Object.keys(model.schema.paths).join(', '));
        });

        console.log('\nDatabase initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
};

initDB(); 