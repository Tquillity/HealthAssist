import express from 'express';
import Routine from '../models/Routine';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import upload from '../middleware/upload';

// Admin-only middleware
const requireAdmin = (req: AuthRequest, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const router = express.Router();

// Get all routines with optional filtering
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { category, context, energy, duration, difficulty } = req.query;
    
    const filter: any = { isActive: true };
    
    if (category) filter.category = category;
    if (context) filter['metadata.context'] = context;
    if (energy) filter['metadata.energy'] = energy;
    if (duration) filter['metadata.duration'] = duration;
    if (difficulty) filter['metadata.difficulty'] = difficulty;

    const routines = await Routine.find(filter).sort({ createdAt: -1 });
    res.json(routines);
  } catch (error) {
    console.error('Routines fetch error:', error);
    res.status(500).json({ message: 'Server error fetching routines' });
  }
});

// Get routine by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    
    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    res.json(routine);
  } catch (error) {
    console.error('Routine fetch error:', error);
    res.status(500).json({ message: 'Server error fetching routine' });
  }
});

// Todo-lottery: Get random routine(s) based on filters
router.post('/lottery', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { 
      count = 1, 
      category, 
      context, 
      energy, 
      duration, 
      difficulty,
      excludeIds = [] 
    } = req.body;

    const filter: any = { 
      isActive: true,
      _id: { $nin: excludeIds }
    };
    
    if (category) filter.category = category;
    if (context) filter['metadata.context'] = context;
    if (energy) filter['metadata.energy'] = energy;
    if (duration) filter['metadata.duration'] = duration;
    if (difficulty) filter['metadata.difficulty'] = difficulty;

    // Get all matching routines
    const allRoutines = await Routine.find(filter);
    
    if (allRoutines.length === 0) {
      return res.json({ 
        message: 'No routines found matching your criteria',
        routines: []
      });
    }

    // Shuffle and select random routines
    const shuffled = allRoutines.sort(() => 0.5 - Math.random());
    const selectedRoutines = shuffled.slice(0, Math.min(count, allRoutines.length));

    res.json({
      message: `Selected ${selectedRoutines.length} routine(s)`,
      routines: selectedRoutines,
      totalAvailable: allRoutines.length
    });
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
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const routineData = {
      ...req.body,
      createdBy: req.user._id
    };

    const routine = new Routine(routineData);
    await routine.save();

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
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const routine = await Routine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    res.json({
      message: 'Routine updated successfully',
      routine
    });
  } catch (error) {
    console.error('Routine update error:', error);
    res.status(500).json({ message: 'Server error updating routine' });
  }
});

// Delete routine (Admin only - soft delete)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const routine = await Routine.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    res.json({
      message: 'Routine deleted successfully',
      routine
    });
  } catch (error) {
    console.error('Routine deletion error:', error);
    res.status(500).json({ message: 'Server error deleting routine' });
  }
});

// Get routine categories
router.get('/meta/categories', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const categories = await Routine.distinct('category', { isActive: true });
    const contexts = await Routine.distinct('metadata.context', { isActive: true });
    const energyLevels = await Routine.distinct('metadata.energy', { isActive: true });
    const durations = await Routine.distinct('metadata.duration', { isActive: true });
    const difficulties = await Routine.distinct('metadata.difficulty', { isActive: true });

    res.json({
      categories,
      contexts,
      energyLevels,
      durations,
      difficulties
    });
  } catch (error) {
    console.error('Routine metadata error:', error);
    res.status(500).json({ message: 'Server error fetching routine metadata' });
  }
});

export default router;
