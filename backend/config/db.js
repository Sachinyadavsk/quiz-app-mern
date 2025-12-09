import mongoose from 'mongoose';

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URL, {
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
};

export default connectDB;