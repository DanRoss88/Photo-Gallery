import mongoose from "mongoose";
import User from "../models/user.model";
import Photo from "../models/photo.model";
import connectDB from "../config/db";
import { seedUsers, seedPhotos } from "./data"; // Assuming seed data is in a separate file

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Photo.deleteMany({});

    console.log("Existing data cleared");

    const users = await User.insertMany(seedUsers);
    console.log(`${users.length} users seeded`);

    const photosWithUsers = seedPhotos.map((photo, index) => ({
      ...photo,
      user: users[index % users.length]._id, // Assign a user from the seeded users
    }));

    const photos = await Photo.insertMany(photosWithUsers);
    console.log(`${photos.length} photos seeded`);

    mongoose.connection.close(); // Close the connection after seeding
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

// Run the seed script
seedData();
