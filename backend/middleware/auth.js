const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return next(new ErrorHandler('Please Login to access the resources', 401));

    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler('You are not authorized to access this resource', 403));
        }
        next();
    }
}
