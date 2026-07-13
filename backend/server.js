const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();
console.log("Environment loaded", !!process.env.MONGO_URI);

// Trigger Nodemon Environment Reload: Load updated Twilio settings
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const contactRoutes = require('./routes/contactRoutes');

const Admin = require('./models/Admin');

// Initialize database connection


const app = express();

// Security Headers
app.use(helmet({
    contentSecurityPolicy: false // Allow inline scripts for frontend integration
}));

// CORS Configuration
app.use(cors());

// Request logger middleware (morgan)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "IECLATE INOVATE Backend is Running 🚀",
        health: "/api/health"
    });
});

// Health Check API endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "IECLATE INOVATE backend API is fully operational",
        timestamp: new Date()
    });
});

// Mounting MVC Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/contact', contactRoutes);

// Database Seeding: Automatically create default administrator credentials if none exist
const seedAdminAccount = async () => {
    try {
        const admin = await Admin.findOne({ email: 'admin@ieclateinovate.com' });
        if (!admin) {
            console.log('[Seed] Seeding default administrator account credentials...');
            await Admin.create({
                email: 'admin@ieclateinovate.com',
                password: 'password123', // Automatically hashed by Mongoose schema hook
                mobileNumber: '+916378966541' // Set strictly required mobile number
            });
            console.log('[Seed] Default admin account successfully created: admin@ieclateinovate.com / password123');
        } else {
            // Force reset phone number to strictly required number
            await Admin.updateOne(
                { email: 'admin@ieclateinovate.com' },
                { $set: { mobileNumber: '+916378966541' } }
            );
            console.log('[Seed] Reset admin phone number in database to strictly required +916378966541');
        }
    } catch (error) {
        console.error(`[Seed] Administrator account seeding failed: ${error.message}`);
    }
};

// Execute Seeding on boot


// Serve Static Uploads folder if Multer is used
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global Error Handler Middleware (Must be registered last)
app.use(errorHandler);

// Server Booting Configuration
// Server Booting Configuration
const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Seed default admin
        await seedAdminAccount();

        // Start Express server
        server = app.listen(PORT, () => {
            console.log(
                `[Server] IECLATE INOVATE backend active in ${
                    process.env.NODE_ENV || "production"
                } mode on port ${PORT}`
            );
        });
    } catch (error) {
        console.error("[Startup Error]", error.message);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections globally
process.on("unhandledRejection", (err) => {
    console.error("[Server Error] Unhandled Rejection:", err.message);

    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});
