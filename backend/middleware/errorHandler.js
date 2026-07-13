/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log for developer in development environment
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    // Mongoose bad ObjectId format (CastError)
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        return res.status(404).json({ success: false, message });
    }

    // Mongoose duplicate key error (11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate value entered for ${field} field. Value already exists.`;
        return res.status(400).json({ success: false, message });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        return res.status(400).json({ success: false, message });
    }

    // Default 500 Internal Server error
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
