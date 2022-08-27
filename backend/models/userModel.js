const Mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new Mongoose.Schema({
    name:{
        type: String,
        required:[true, "Please Enter Your Name"],
        maxLength:[30, "Name can't be more than 50 characters"],
        minLength:[4, "Name can't be less than 2 characters"]
    },
    email:{
        type: String,
        required:[true, "Please Enter Your Email"],
        unique:true,
        validate: [validator.isEmail, "Please Enter a Valid Email"]
    },
    password:{
        type: String,
        required:[true, "Please Enter Your Password"],
        minLength:[8, "Password can't be less than 8 characters"],
        select: false
    },
    avtar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// Encrypt Password
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
}
);

// JWT Token
UserSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// Match Password
UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

// Generate Reset Password Token
UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}



module.exports = Mongoose.model('User', UserSchema);