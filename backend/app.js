const express = require('express');
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const error = require('./middleware/error');
const cookieParser = require('cookie-parser');

const app = express();


app.use(express.json());
app.use(cookieParser());

// Route for products
app.use('/api/v1',product);

// Route for users
app.use('/api/v1',user);

// Route for orders
app.use('/api/v1',order);

// Middleware for Error Handler
app.use(error)

module.exports = app;