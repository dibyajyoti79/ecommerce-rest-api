const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAyncError = require('../middleware/catchAsyncError');
const sendJwtToken = require('../utils/sendJwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register User
exports.registerUser = catchAyncError(async (req, res, next) => {
    const newUser = await User.create(req.body);
    const token = await newUser.getJwtToken();
    sendJwtToken(newUser, 201, res);
    }
);

// Login User
exports.loginUser = catchAyncError(async (req, res, next) => {
    const { email, password } = req.body;
    //checking if user has giver email and password
    if (!email || !password) {
        return next(new ErrorHandler('Please provide an email and password', 400));
    }
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if(!user) return next(new ErrorHandler('Invalid Credentials', 401));
    // Check if password is correct
    const isMatch = await user.matchPassword(password);
    if(!isMatch) return next(new ErrorHandler('Invalid Credentials', 401));
    // Send JWT Token
    sendJwtToken(user, 200, res);
}
); 

// Logout User
exports.logoutUser = catchAyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
}
);

// Forget Password
exports.forgetPassword = catchAyncError(async (req, res, next) => {
    const { email } = req.body;
    //checking if user has giver email
    if (!email) {
        return next(new ErrorHandler('Please provide an email', 400));
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if(!user) return next(new ErrorHandler('Invalid Credentials', 401));
    
    // get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is ${resetUrl} \n\n If you did not request this please ignore this email.`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token',   
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email successfully'
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler('Email could not be sent', 500));
    }
}
);

// Reset Password
exports.resetPassword = catchAyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({resetPasswordToken, resetPasswordExpire: { $gt: Date.now() }});
    if(!user) return next(new ErrorHandler('Invalid Token', 400));

    if(req.body.password !== req.body.confirmPassword) return next(new ErrorHandler('Passwords do not match', 400));
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    sendJwtToken(user, 200, res);
});


// Get User Details
exports.getUserDetails = catchAyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: 'true',
        user
    });
}
);

// Update User Password
exports.updateUserPassword = catchAyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password'); 

    // Check if current password is correct
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if(!isMatch) return next(new ErrorHandler('Password is incorrect', 401));
    // Check if new password is correct
    if(req.body.newPassword !== req.body.confirmPassword) return next(new ErrorHandler('Passwords do not match', 400));
    user.password = req.body.newPassword;
    await user.save();
    sendJwtToken(user, 200, res);
});


// Update User Details
exports.updateUserDetails = catchAyncError(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        success: true,
    })
}
);

// Get All Users -- Admin Only
exports.getAllUsers = catchAyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'true',
        users
    });
}
);

// Get Single User -- Admin Only
exports.getSingleUser = catchAyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) return next(new ErrorHandler('User not found', 404)); // if user not found
    res.status(200).json({
        status: 'true',
        user
    });
}
);


// Update User Role -- Admin Only
exports.updateUserRoles = catchAyncError(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!user) return next(new ErrorHandler('User not found', 404)); // if user not found
    
    res.status(200).json({
        success: true,
    })
}
);

// Delete User -- Admin Only    
exports.deleteUser = catchAyncError(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return next(new ErrorHandler('User not found', 404)); // if user not found
    res.status(200).json({
        status: 'true',
        message: 'User deleted successfully'
    });
}
);
