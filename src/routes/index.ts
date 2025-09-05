import express, { Router, Request, Response } from 'express';
import userRoutes from './userRoutes';

const router: Router = express.Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'API is operational',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
router.use('/users', userRoutes);

export default router;
