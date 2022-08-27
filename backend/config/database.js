const mongoose = require('mongoose');   

// const connectDatabase = async () => {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }); 
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
// }

// module.exports = connectDatabase;

// alternative way to connect to mongoDB
const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
};
module.exports = connectDatabase;



