import mongoose from 'mongoose';
import User from '../models/user.model';
import Photo from '../models/photo.model';
import connectDB from '../config/db';
import { seedUsers, seedPhotos } from './data';  // Assuming seed data is in a separate file

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Photo.deleteMany({});

    console.log('Existing data cleared');

    const users = await User.insertMany(seedUsers);
    console.log(`${users.length} users seeded`);

    const photos = await Photo.insertMany(seedPhotos);
    console.log(`${photos.length} photos seeded`);

    mongoose.connection.close(); 
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();