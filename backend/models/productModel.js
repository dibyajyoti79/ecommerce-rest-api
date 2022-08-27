const mongoose = require('mongoose');

const producSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please enter a description']
    },
    price: {
        type: Number,
        required: [true, 'Please enter a price'],
        maxLength: [10, 'Price must be less than 10 digits']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }

        }
    ],
    category: {
        type: String,
        required: [true, 'Please enter product category']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [10, 'Stock cannot be more than 10 digits'],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
 
});

module.exports = mongoose.model('Product', producSchema);