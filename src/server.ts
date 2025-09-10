import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import prisma from './lib/prisma';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Thooral Backend API'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// Test database connection
async function testDatabaseConnection() {
  try {
    // Try to connect to the database
    await prisma.$connect();
    console.log('Connected to PostgreSQL database successfully');

    
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to the database:');
    console.error(error);
    return false;
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Test database connection
  const isConnected = await testDatabaseConnection();
  if (!isConnected) {
    console.error('⚠️  Warning: Server is running but database connection failed');
    console.error('⚠️  Please check your database configuration in .env file');
  }
});

export default app;
