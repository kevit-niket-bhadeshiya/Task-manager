const mongoose = require('mongoose');

// Function to connect to database.
const connectDB = async() => {
    try {
        
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('DB connected..!!');
        
    } catch (error) {
        console.log(error);
    } 
}

module.exports = connectDB;
