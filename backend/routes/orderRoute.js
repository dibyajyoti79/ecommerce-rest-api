const express = require('express');
const { createOrder, getOrder, myorder, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const router = express.Router();
const {isAuthenticated, authorizeRoles} = require('../middleware/auth');



// create a new order
router.route('/order/new').post(isAuthenticated,createOrder);

router.route('/order/:id').get(isAuthenticated,getOrder );

router.route('/orders/my').get(isAuthenticated,myorder);

router.route('/admin/orders').get(isAuthenticated,authorizeRoles('admin'),getAllOrders);

router.route('/admin/order/:id').put(isAuthenticated,authorizeRoles('admin'),updateOrderStatus);

router.route('/admin/order/:id').delete(isAuthenticated,authorizeRoles('admin'),deleteOrder);




module.exports = router;