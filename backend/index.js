const app = require('./server');
const config = require('./config/serverconfig');
const connectDB = require('./config/db');

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        app.listen(config.port, () => {
            console.log(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 