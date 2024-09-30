import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import userRoutes from './routes/user.routes';
import photoRoutes from './routes/photo.routes';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Routes
app.use('/api/users', userRoutes);
app.use('/api/photos', photoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));