import express from 'express';
import { register, login, logout, getUsernameById } from '../controllers/user.controllers';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.get('/:id', getUsernameById);

export default router;
