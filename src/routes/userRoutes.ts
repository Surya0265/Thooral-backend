import express, { Router } from 'express';
import { 
  getUsers, 
  getUserById, 
  getCurrentUser, 
  updateCurrentUser, 
  deleteUser 
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Protected routes (require authentication)
router.get('/me', protect, getCurrentUser);
router.put('/me', protect, updateCurrentUser);

// Public routes
router.get('/', getUsers);
router.get('/:id', getUserById);

// Admin routes
router.delete('/:id', protect, deleteUser);

export default router;
