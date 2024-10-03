import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AsyncRequestHandler, UserPayload } from "../types";
import { JWT_SECRET } from "../config/env";
import { AppError } from "../utils/errorHandler";

const jwt_secret = JWT_SECRET;

const generateToken = (userId: string): string => {
  return jwt.sign({ _id: userId }, jwt_secret, { expiresIn: "1d" });
};

export const register: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id.toString());
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res
      .status(201)
      .json({
        user: { _id: user._id, username: user.username, email: user.email },
      });
  } catch (error) {
    next(error);
  }
};

export const login: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken(user._id.toString());
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const logout: AsyncRequestHandler = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const verifyToken: AsyncRequestHandler = async (req, res) => {
  res.json(req.user);
};
