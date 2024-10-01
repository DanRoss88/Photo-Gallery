import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import path from 'path';
import connectDB from './config/db';
import { PORT } from './config/env';
import { globalErrorHandler } from './utils/errorHandler';
import { AppError } from './utils/errorHandler';

import userRoutes from './routes/user.routes';
import photoRoutes from './routes/photo.routes';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3002',
    credentials: true,
}));
app.use(express.static('uploads'));
app.use(globalErrorHandler);

// Routes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/users', userRoutes);
app.use('/api/photos', photoRoutes);
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
const Port = PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${Port}`));