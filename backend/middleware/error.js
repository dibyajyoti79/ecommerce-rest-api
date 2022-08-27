const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal servere error";

    // Wrong mongodb ID error
    if (err.name === "CastError") {
        const  message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 404); 
    }

    // Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate field value: ${Object.keys(err.keyValue)}. Please use another value`;
        err = new ErrorHandler(message, 400);
    }

    // wrong JWT token error
    if (err.name === "JsonWebTokenError") {
        err = new ErrorHandler("Invalid token", 401);
    }

    // JWT expired error
    if (err.name === "TokenExpiredError") {
        err = new ErrorHandler("Token expired", 401);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}