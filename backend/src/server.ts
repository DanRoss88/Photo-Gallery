import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import connectDB from './config/db';
import { PORT, CLIENT } from './config/env';
import { globalErrorHandler } from './utils/errorHandler';
import { AppError } from './utils/errorHandler';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import userRoutes from './routes/user.routes';
import photoRoutes from './routes/photo.routes';
import verifyTokenRoute from './routes/auth.routes';

const app = express();
const Client = CLIENT as string;
// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: Client,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(
  express.static(path.join(__dirname, 'build'), {
    maxAge: '1d', // Cache files for 1 day
  })
);
app.use(express.static('uploads'));
app.use(globalErrorHandler);
app.use((req, res, next) => {
  console.log('Received request:');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Photo Gallery API" });
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/users', userRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/auth', verifyTokenRoute);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
const Port = PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${Port}`));
