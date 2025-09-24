import express from 'express';
import Recipe from '../models/Recipe';
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

// Get all recipes for household
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { category, difficulty, dietaryTags, search } = req.query;
    
    const filter: any = { 
      householdId: req.user.householdId,
      isShared: true 
    };
    
    if (category) filter['metadata.category'] = category;
    if (difficulty) filter['metadata.difficulty'] = difficulty;
    if (dietaryTags) filter['metadata.dietaryTags'] = { $in: Array.isArray(dietaryTags) ? dietaryTags : [dietaryTags] };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'metadata.tags': { $regex: search, $options: 'i' } }
      ];
    }

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    console.error('Recipes fetch error:', error);
    res.status(500).json({ message: 'Server error fetching recipes' });
  }
});

// Get recipe by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const recipe = await Recipe.findOne({ 
      _id: req.params.id,
      householdId: req.user.householdId 
    });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Recipe fetch error:', error);
    res.status(500).json({ message: 'Server error fetching recipe' });
  }
});

// Upload recipe image (Admin only)
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

// Create new recipe (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const recipeData = {
      ...req.body,
      householdId: req.user.householdId,
      createdBy: req.user._id
    };

    const recipe = new Recipe(recipeData);
    await recipe.save();

    res.status(201).json({
      message: 'Recipe created successfully',
      recipe
    });
  } catch (error) {
    console.error('Recipe creation error:', error);
    res.status(500).json({ message: 'Server error creating recipe' });
  }
});

// Update recipe (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { 
        _id: req.params.id,
        householdId: req.user.householdId 
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({
      message: 'Recipe updated successfully',
      recipe
    });
  } catch (error) {
    console.error('Recipe update error:', error);
    res.status(500).json({ message: 'Server error updating recipe' });
  }
});

// Delete recipe (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      householdId: req.user.householdId
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({
      message: 'Recipe deleted successfully',
      recipe
    });
  } catch (error) {
    console.error('Recipe deletion error:', error);
    res.status(500).json({ message: 'Server error deleting recipe' });
  }
});

// Get recipe metadata for filtering
router.get('/meta/categories', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const categories = await Recipe.distinct('metadata.category', { 
      householdId: req.user.householdId,
      isShared: true 
    });
    const difficulties = await Recipe.distinct('metadata.difficulty', { 
      householdId: req.user.householdId,
      isShared: true 
    });
    const dietaryTags = await Recipe.distinct('metadata.dietaryTags', { 
      householdId: req.user.householdId,
      isShared: true 
    });
    const cuisines = await Recipe.distinct('metadata.cuisine', { 
      householdId: req.user.householdId,
      isShared: true 
    });

    res.json({
      categories,
      difficulties,
      dietaryTags,
      cuisines
    });
  } catch (error) {
    console.error('Recipe metadata error:', error);
    res.status(500).json({ message: 'Server error fetching recipe metadata' });
  }
});

export default router;
