import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AsyncRequestHandler, UserPayload } from "../types";
import { validateRequiredFields } from "../utils/helpers";
import { JWT_SECRET } from "../config/env";
import { catchAsync } from "../utils/errorHandler";
import { Response } from "express";
import { AuthRequest } from "../types";
import { AppError } from "../utils/errorHandler";
const jwt_secret = JWT_SECRET;

export const register: AsyncRequestHandler = async (req, res) => {
    const { username, email, password } = req.body;
    const validationError = validateRequiredFields(req.body, [
      "username",
      "email",
      "password",
    ]);
    if (validationError) {
      res.status(400).json({ msg: validationError });
      return;
    }
  
    try {
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ msg: "User already exists" });
        return;
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      user = new User({ username, email, password: hashedPassword });
      await user.save();
  
      const token = jwt.sign({ userId: user._id }, jwt_secret, { expiresIn: '1h' });
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
        maxAge: 3600 * 1000, 
      });
  
      res.json({ msg: "User registered successfully", user: { _id: user._id, username: user.username, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  };

  export const login: AsyncRequestHandler = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ msg: "Invalid credentials" });
        return;
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ msg: "Invalid credentials" });
        return;
      }
  
      const token = jwt.sign({ userId: user._id }, jwt_secret, { expiresIn: '1h' });
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600 * 1000, 
      });
  
      res.json({ msg: "Login successful", user: { _id: user._id, username: user.username, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  };
  
  export const verifyToken: AsyncRequestHandler = async (req, res) => {
    const token = req.cookies.token; // Check for token in cookies
    if (!token) {
      res.status(401).json({ msg: 'No token, authorization denied' });
      return 
    }
    try {
      const decoded = jwt.verify(token, jwt_secret) as UserPayload; // Decode token
      const user = await User.findById(decoded._id).select('-password'); // Get user
      if (!user) {
        res.status(404).json({ msg: 'User not found' });
        return 
      }
      res.status(200).json(user); // Return user if valid token
      return 
    } catch (err) {
      res.status(401).json({ msg: 'Invalid token or session expired' });
      return 
    }
  };

  export const logout: AsyncRequestHandler = async (req, res) => {
    res.clearCookie('token');
    res.json({ msg: 'Logged out successfully' });
    return;
  };

  // BOOKMARKS //
  export const getUserBookmarks = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("bookmarks"); 

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.status(200).json({
        total: user.bookmarks.length,
        photos: user.bookmarks,
    });
});


