import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Get all users
 * @route GET /api/users
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        schoolName: true,
        isVerified: true,
        createdAt: true,
      }
    });
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching users'
    });
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        schoolName: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: `User with ID ${id} not found`
      });
      return;
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the user'
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/users/me
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        schoolName: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user profile'
    });
  }
};

/**
 * Update current user
 * @route PUT /api/users/me
 */
export const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
      return;
    }
    
    const { fullName, schoolName } = req.body;
    
    // Validate input
    if (!fullName && !schoolName) {
      res.status(400).json({
        status: 'error',
        message: 'At least one field is required to update'
      });
      return;
    }
    
    // Prepare update data
    const updateData: { fullName?: string; schoolName?: string } = {};
    if (fullName) updateData.fullName = fullName;
    if (schoolName) updateData.schoolName = schoolName;
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        schoolName: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.status(200).json({
      status: 'success',
      message: 'User profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update current user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating user profile'
    });
  }
};

/**
 * Delete a user (admin only)
 * @route DELETE /api/users/:id
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!userExists) {
      res.status(404).json({
        status: 'error',
        message: `User with ID ${id} not found`
      });
      return;
    }
    
    // Delete user
    await prisma.user.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting the user'
    });
  }
};
