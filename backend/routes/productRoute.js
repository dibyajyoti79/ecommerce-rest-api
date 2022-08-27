const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createReview, getAllReviews,deleteReview } = require('../controllers/productController');
const {isAuthenticated, authorizeRoles} = require('../middleware/auth');
const router = express.Router();
 

// createProduct route
router.route('/admin/product/new').post(isAuthenticated,authorizeRoles("admin"), createProduct);

// getAllProducts route
router.route('/products').get(getAllProducts);

// updateProduct route
router.route('/admin/product/:id').put(isAuthenticated,authorizeRoles("admin"), updateProduct);

// deleteProduct route
router.route('/admin/product/:id').delete(isAuthenticated,authorizeRoles("admin"), deleteProduct);

// getProductDetails route
router.route('/product/:id').get(getProductDetails);

// create review
router.route('/review').put(isAuthenticated, createReview);

// Get All review
router.route('/reviews').get(getAllReviews);

// Delete review
router.route('/reviews').delete(isAuthenticated,deleteReview );











module.exports = router;