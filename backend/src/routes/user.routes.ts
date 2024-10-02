import express from 'express';
import { register, login, logout } from '../controllers/user.controllers';
import {auth} from '../middleware/auth';
import { getUserBookmarks } from '../controllers/user.controllers';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.get('/:id/bookmarks', auth, getUserBookmarks)

export default router;