import { Request, Response, NextFunction } from 'express';

export interface UserPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export type AsyncRequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;