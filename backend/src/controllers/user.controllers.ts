import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { AsyncRequestHandler } from '../types';
import { JWT_SECRET } from '../config/env';

const jwt_secret = JWT_SECRET;

export const register: AsyncRequestHandler = async (req, res) => {
    console.log("Request method:", req.method);
    console.log("Request headers:", req.headers);
    console.log("Request content-type:", req.headers['content-type']);
    console.log("Request body:", req.body);  
    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ msg: 'User already exists' });
        return;
      };
      if (!password) {
        res.status(400).json({ message: "Password is required" });
        return 
      };
      
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = new User({ username, email, password: hashedPassword });
      await user.save();
  
      const payload = { id: user._id };
      const token = jwt.sign(payload, jwt_secret, { expiresIn: 3600 });
  
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
};
  
export const login: AsyncRequestHandler = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ msg: 'Invalid credentials' });
        return;
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ msg: 'Invalid credentials' });
        return;
      }
  
      const payload = { id: user._id };
      const token = jwt.sign(payload, jwt_secret , { expiresIn: 3600 });
  
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
};