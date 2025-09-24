import express from 'express';
import { z } from 'zod';
import * as routineService from '../services/routineService';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';
import upload from '../middleware/upload';

// Admin-only middleware
const requireAdmin = (req: AuthRequest, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const router = express.Router();

// Validation schemas
const routineParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Routine ID is required'),
  }),
});

const lotterySchema = z.object({
  body: z.object({
    count: z.number().int().min(1, 'Count must be at least 1').max(10, 'Count must be at most 10').optional(),
    category: z.string().optional(),
    context: z.string().optional(),
    energy: z.string().optional(),
    duration: z.string().optional(),
    difficulty: z.string().optional(),
    excludeIds: z.array(z.string()).optional(),
  }),
});

const createRoutineSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
    category: z.string().min(1, 'Category is required'),
    context: z.array(z.string()).min(1, 'At least one context is required'),
    energy: z.enum(['low', 'medium', 'high']),
    duration: z.enum(['short', 'medium', 'long']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    steps: z.array(z.object({
      title: z.string().min(1, 'Step title is required'),
      description: z.string().min(1, 'Step description is required'),
      duration: z.number().int().min(1, 'Step duration must be at least 1 minute'),
    })).min(1, 'At least one step is required'),
    imageUrl: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateRoutineSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Routine ID is required'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').optional(),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters').optional(),
    category: z.string().min(1, 'Category is required').optional(),
    context: z.array(z.string()).min(1, 'At least one context is required').optional(),
    energy: z.enum(['low', 'medium', 'high']).optional(),
    duration: z.enum(['short', 'medium', 'long']).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    steps: z.array(z.object({
      title: z.string().min(1, 'Step title is required'),
      description: z.string().min(1, 'Step description is required'),
      duration: z.number().int().min(1, 'Step duration must be at least 1 minute'),
    })).min(1, 'At least one step is required').optional(),
    imageUrl: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// Get all routines with optional filtering
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const filters = {
      category: req.query.category as string,
      context: req.query.context as string,
      energy: req.query.energy as string,
      duration: req.query.duration as string,
      difficulty: req.query.difficulty as string
    };
    
    const routines = await routineService.getRoutines(filters);
    res.json(routines);
  } catch (error) {
    console.error('Routines fetch error:', error);
    res.status(500).json({ message: 'Server error fetching routines' });
  }
});

// Get routine by ID
router.get('/:id', authenticateToken, validate(routineParamsSchema), async (req: AuthRequest, res) => {
  try {
    const routine = await routineService.getRoutineById(req.params.id);
    res.json(routine);
  } catch (error) {
    console.error('Routine fetch error:', error);
    if (error instanceof Error && error.message === 'Routine not found') {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.status(500).json({ message: 'Server error fetching routine' });
  }
});

// Todo-lottery: Get random routine(s) based on filters
router.post('/lottery', authenticateToken, validate(lotterySchema), async (req: AuthRequest, res) => {
  try {
    const data = {
      count: req.body.count || 1,
      category: req.body.category,
      context: req.body.context,
      energy: req.body.energy,
      duration: req.body.duration,
      difficulty: req.body.difficulty,
      excludeIds: req.body.excludeIds || []
    };

    const result = await routineService.getRoutineLottery(data);
    res.json(result);
  } catch (error) {
    console.error('Routine lottery error:', error);
    res.status(500).json({ message: 'Server error in routine lottery' });
  }
});

// Upload routine image (Admin only)
router.post('/upload-image', authenticateToken, requireAdmin, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Return the file path for the frontend to use
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Server error uploading image' });
  }
});

// Create new routine (Admin only)
router.post('/', authenticateToken, requireAdmin, validate(createRoutineSchema), async (req: AuthRequest, res) => {
  try {
    const routine = await routineService.createRoutine(req.user._id, req.body);

    res.status(201).json({
      message: 'Routine created successfully',
      routine
    });
  } catch (error) {
    console.error('Routine creation error:', error);
    res.status(500).json({ message: 'Server error creating routine' });
  }
});

// Update routine (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validate(updateRoutineSchema), async (req: AuthRequest, res) => {
  try {
    const routine = await routineService.updateRoutine(req.params.id, req.body);

    res.json({
      message: 'Routine updated successfully',
      routine
    });
  } catch (error) {
    console.error('Routine update error:', error);
    if (error instanceof Error && error.message === 'Routine not found') {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.status(500).json({ message: 'Server error updating routine' });
  }
});

// Delete routine (Admin only - soft delete)
router.delete('/:id', authenticateToken, requireAdmin, validate(routineParamsSchema), async (req: AuthRequest, res) => {
  try {
    const routine = await routineService.deleteRoutine(req.params.id);

    res.json({
      message: 'Routine deleted successfully',
      routine
    });
  } catch (error) {
    console.error('Routine deletion error:', error);
    if (error instanceof Error && error.message === 'Routine not found') {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.status(500).json({ message: 'Server error deleting routine' });
  }
});

// Get routine categories
router.get('/meta/categories', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const metadata = await routineService.getRoutineMetadata();
    res.json(metadata);
  } catch (error) {
    console.error('Routine metadata error:', error);
    res.status(500).json({ message: 'Server error fetching routine metadata' });
  }
});

export default router;
