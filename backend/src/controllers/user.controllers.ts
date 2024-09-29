import User from "../models/user.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';


export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      user = new User({ username, email, password });
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      await user.save();
  
      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: 3600 });
  
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };
  
  export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: 3600 });
  
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };