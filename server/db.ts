import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use a local MongoDB URI if environment variable is not set
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dripster';
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Don't exit the process, just continue without MongoDB
    console.warn("⚠️  Continuing without MongoDB - using in-memory storage");
  }
};

export default connectDB;