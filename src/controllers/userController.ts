import { Request, Response } from 'express';
import { User } from '../types/user';

// Mock database
let users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
];

/**
 * Get all users
 */
export const getUsers = (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
};

/**
 * Get user by ID
 */
export const getUserById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);

  if (!user) {
    res.status(404).json({
      status: 'error',
      message: `User with ID ${id} not found`
    });
    return;
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
};

/**
 * Create a new user
 */
export const createUser = (req: Request, res: Response): void => {
  const { name, email, role } = req.body;

  // Validate input
  if (!name || !email) {
    res.status(400).json({
      status: 'error',
      message: 'Name and email are required'
    });
    return;
  }

  // Create new user
  const newUser: User = {
    id: (users.length + 1).toString(),
    name,
    email,
    role: role || 'user'
  };

  users.push(newUser);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
};

/**
 * Update a user
 */
export const updateUser = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    res.status(404).json({
      status: 'error',
      message: `User with ID ${id} not found`
    });
    return;
  }

  // Update user
  const updatedUser = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    role: role || users[userIndex].role
  };

  users[userIndex] = updatedUser;

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
};

/**
 * Delete a user
 */
export const deleteUser = (req: Request, res: Response): void => {
  const { id } = req.params;
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    res.status(404).json({
      status: 'error',
      message: `User with ID ${id} not found`
    });
    return;
  }

  // Delete user
  users = users.filter(u => u.id !== id);

  res.status(204).send();
};
