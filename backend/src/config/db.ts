import mongoose from 'mongoose';
import { MONGO_URI } from './env';

const MONGO = MONGO_URI;

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;