const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAyncError = require('../middleware/catchAsyncError');

// Create a new order
exports.createOrder = catchAyncError(async (req, res, next) => {
    
    const { 
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        status: 'success',
        data: order
    });
}
);


// get single order
exports.getOrder = catchAyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return next(new ErrorHandler('Order not found', 404));
    res.status(200).json({
        status: 'success',
        data: order
    });
});


// get login user order
exports.myorder = catchAyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
        status: 'success',
        data: orders
    });
});

// get all order -- admin
exports.getAllOrders = catchAyncError(async (req, res, next) => {
    const orders = await Order.find();

    let total = 0;
    orders.forEach(order => {
        total += order.totalPrice;
    }
    );


    res.status(200).json({
        status: 'success',
        total,
        data: orders
    });
});


// Update Order Status -- admin
exports.updateOrderStatus = catchAyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
   
    if(!order) return next(new ErrorHandler('Order not found', 404));
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler('Order already delivered', 400));
    }

    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity);
    })

    order.orderStatus = req.body.status;
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });


    res.status(200).json({
        status: 'success',
    });
});

async function updateStock(productId, quantity){
    const product = await Product.findById(productId);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}


// Delete Order -- admin
exports.deleteOrder = catchAyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorHandler('Order not found', 404));
    await order.remove();
    res.status(200).json({
        status: 'success',
    });
}
);