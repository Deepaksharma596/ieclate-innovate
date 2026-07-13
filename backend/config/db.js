const mongoose = require('mongoose');

/**
 * Establish asynchronous connection to MongoDB Atlas database.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4
        });
        console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Database] Mongoose Connection Error: ${error.message}`);
        // Exit process with failure code
        process.exit(1);
    }
};

module.exports = connectDB;
