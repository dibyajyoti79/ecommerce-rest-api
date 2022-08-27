const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');

// Create Product -- Admin Only
exports.createProduct = catchAyncError(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
}
);

// Get All Products -- Admin Only
exports.getAllProducts = catchAyncError(async (req, res) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        products,
        productCount,
    })
});

// Update Product -- Admin Only
exports.updateProduct = catchAyncError(async (req, res,next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    await product.updateOne(req.body);
    res.status(200).json({
        success: true,
        product
    })
});

// Delete Product -- Admin Only
exports.deleteProduct = catchAyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: 'Product deleted'
    })
});

// Get Product Details -- Admin Only
exports.getProductDetails = catchAyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product
    })
});

// Create New Review or update existing review
exports.createReview = catchAyncError(async (req, res, next) => {

    const {rating, comment, productId} = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment,
    };
    console.log(productId);
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    const isReviewed = product.reviews.find(review => review.user.toString() === req.user.id);
    if(isReviewed){
        product.forEach(review => {
            if(review.user.toString() === req.user.id){
                review.rating = Number(rating);
                review.comment = comment;
            }
        }
        );
    }
    else{
        product.reviews.push(review);
        product.numOfReviews++;
    }

    let avg = 0;
    product.ratings = product.reviews.forEach(review => {
        avg += review.rating;
    })
    product.ratings = avg / product.numOfReviews;
    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success: true,
        product
    })
    
});

// Get All Reviews of a product
exports.getAllReviews = catchAyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
});


// Delete Review of a product
exports.deleteReview = catchAyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    product.reviews = reviews;
    product.numOfReviews--;

    let avg = 0;
    product.ratings = product.reviews.forEach(review => {
        avg += review.rating;
    })
    product.ratings = avg / product.numOfReviews;
    await product.save({validateBeforeSave: false});
    
    res.status(200).json({
        success: true
    })
}
);
