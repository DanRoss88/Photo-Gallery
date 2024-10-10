import mongoose from 'mongoose';
import User from '../models/user.model';
import Photo, { IPhoto } from '../models/photo.model';
import connectDB from '../config/db';
import { seedUsers, seedPhotos } from './data'; // Assuming seed data is in a separate file

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Photo.deleteMany({});

    console.log('Existing data cleared');

    const users = await User.insertMany(seedUsers);
    console.log(`${users.length} users seeded`);

    const photosWithUsers: IPhoto[] = await Promise.all(
      seedPhotos.map(async (photo) => {
        const user = users[Math.floor(Math.random() * users.length)];
        const otherUsers = users.filter((u) => u.id.toString() !== user.id.toString());

        const likes = otherUsers.slice(0, Math.floor(Math.random() * otherUsers.length)).map((u) => u._id);
        const bookmarkedBy = otherUsers.slice(0, Math.floor(Math.random() * otherUsers.length)).map((u) => u._id);

        const newPhoto = {
          ...photo,
          user: user._id, // Assign the user
          likes, // Assign random likes
          bookmarkedBy, // Assign random bookmarks
        };

        return newPhoto as unknown as IPhoto; // Cast through unknown
      })
    );

    const photos = await Photo.insertMany(photosWithUsers);
    console.log(`${photos.length} photos seeded`);

    mongoose.connection.close(); // Close the connection after seeding
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run the seed script
seedData();
