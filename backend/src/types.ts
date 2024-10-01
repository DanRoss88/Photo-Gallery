import { Request, Response, NextFunction } from 'express';

export interface UserPayload {
  _id: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export type AsyncRequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export interface PhotoInput {
  user: string;
  imageUrl: string;
  description?: string;
}