const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Handling uncaughtException
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaughtException`);
    process.exit(1);
})


// config dotenv
dotenv.config({path: 'backend/config/config.env'});

// connect to mongodb
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// unhandeled promise rejections
process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled promise Rejection`);
    
    server.close(()=>{
        process.efxit(1);
    });
});