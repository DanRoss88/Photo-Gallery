import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserPayload } from '../types';
import { JWT_SECRET } from '../config/env';
import { AppError } from '../utils/errorHandler';
import User from '../models/user.model';

const jwt_secret = JWT_SECRET;

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Unauthorized access', 401);
    }

    const decoded = jwt.verify(token, jwt_secret) as UserPayload;
    const user = await User.findById(decoded._id).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
    };
    next();
  } catch (err) {
    next(new AppError('Authentication failed', 401));
  }
};
