// Import dependencies
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const config = require("./config/serverconfig");

// Import route modules
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Initialize express app
const app = express();

// Security middleware
app.use(cors(config.cors));

// Request parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Logging middleware
if (config.nodeEnv === "development") {
    app.use(morgan("dev"));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/transactions', transactionRoutes);

// API root
app.get('/api', (req, res) => {
    res.json({
        message: 'BookSwap API',
        status: 'running'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error",
            ...(config.nodeEnv === "development" && { stack: err.stack }),
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: "Not Found",
        },
    });
});

module.exports = app;
