import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, UserPayload } from "../types";
import { JWT_SECRET } from "../config/env";
import { AppError } from "../utils/errorHandler";
import User from "../models/user.model";

const jwt_secret = JWT_SECRET;

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("No token found in cookies.");
    throw new AppError("Unauthorized access", 401);
  }

  try {
    const decoded = jwt.verify(token, jwt_secret) as UserPayload; 
    console.log("Decoded token:", decoded);
    const user = await User.findById(decoded._id); 

    if (!user) {
      throw new AppError("User not found", 404);
    }

    req.user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err); 
    res.status(401).json({ msg: "Token is not valid" });
  }
};
