import express, { Request, Response, NextFunction } from 'express';
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
const clientOrigin = CLIENT || 'http://localhost:3002';

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
console.log('Client Origin:', clientOrigin);

// CORS configuration
// const corsOptions: cors.CorsOptions = {
//   origin: clientOrigin,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   optionsSuccessStatus: 200,
// };

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    console.log('Request Origin:', origin);
    const allowedOrigins = [
      clientOrigin, 
      'https://retro-photo-gallery.vercel.app'
    ]; // Add Vercel domain

    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests without an origin (likely non-browser clients)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.options('*',cors())
app.use(cors(corsOptions));

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

app.use((req, res, next) => {
  console.log('Received request:');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Routes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/users', userRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/auth', verifyTokenRoute);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Photo Gallery API' });
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const Port = PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${Port}`));
