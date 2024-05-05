

const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose.connect(url)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit with failure
    });
};

module.exports = connectDB;
