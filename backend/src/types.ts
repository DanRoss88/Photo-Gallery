import { Request } from 'express';

export interface UserPayload {
  id: string;
  // Add any other properties that might be in your JWT payload
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}