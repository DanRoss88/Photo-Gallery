import express from 'express';
import { verifyToken } from '../controllers/user.controllers';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/verify-token', auth, verifyToken);

export default router;
