import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserPayload } from '../types';
import { JWT_SECRET } from '../config/env';

const jwt_secret = JWT_SECRET
const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header('x-auth-token');
  
    if (!token) {
      res.status(401).json({ msg: 'No token, authorization denied' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, jwt_secret) as UserPayload;
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
  
  export default auth;