const express = require('express');
const { registerUser, loginUser, logoutUser, forgetPassword, resetPassword, getUserDetails, updateUserPassword, updateUserDetails, getAllUsers, getSingleUser, updateUserRoles, deleteUser } = require('../controllers/userController');
const router = express.Router();
const {isAuthenticated, authorizeRoles} = require('../middleware/auth');


router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').get(logoutUser);

router.route('/password/forget').post(forgetPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/me').get(isAuthenticated, getUserDetails);

router.route('/password/update').put(isAuthenticated, updateUserPassword);

router.route('/me/update').put(isAuthenticated, updateUserDetails);

router.route('/admin/users').get(isAuthenticated,authorizeRoles('admin'), getAllUsers); 

router.route('/admin/users/:id').get(isAuthenticated,authorizeRoles('admin'), getSingleUser);

router.route('/admin/users/:id').put(isAuthenticated,authorizeRoles('admin'), updateUserRoles);

router.route('/admin/users/:id').delete(isAuthenticated,authorizeRoles('admin'), deleteUser);





module.exports = router;