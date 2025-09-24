import express from 'express';
import { z } from 'zod';
import * as recipeService from '../services/recipeService';
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
const recipeParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Recipe ID is required'),
  }),
});

const createRecipeSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
    ingredients: z.array(z.object({
      name: z.string().min(1, 'Ingredient name is required'),
      amount: z.string().min(1, 'Amount is required'),
      unit: z.string().min(1, 'Unit is required'),
    })).min(1, 'At least one ingredient is required'),
    instructions: z.array(z.string().min(1, 'Instruction cannot be empty')).min(1, 'At least one instruction is required'),
    prepTime: z.number().int().min(0, 'Prep time must be non-negative'),
    cookTime: z.number().int().min(0, 'Cook time must be non-negative'),
    servings: z.number().int().min(1, 'Servings must be at least 1'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    category: z.string().min(1, 'Category is required'),
    dietaryTags: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional(),
  }),
});

const updateRecipeSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Recipe ID is required'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').optional(),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters').optional(),
    ingredients: z.array(z.object({
      name: z.string().min(1, 'Ingredient name is required'),
      amount: z.string().min(1, 'Amount is required'),
      unit: z.string().min(1, 'Unit is required'),
    })).min(1, 'At least one ingredient is required').optional(),
    instructions: z.array(z.string().min(1, 'Instruction cannot be empty')).min(1, 'At least one instruction is required').optional(),
    prepTime: z.number().int().min(0, 'Prep time must be non-negative').optional(),
    cookTime: z.number().int().min(0, 'Cook time must be non-negative').optional(),
    servings: z.number().int().min(1, 'Servings must be at least 1').optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    category: z.string().min(1, 'Category is required').optional(),
    dietaryTags: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional(),
  }),
});

// Get all recipes for household
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const filters = {
      category: req.query.category as string,
      difficulty: req.query.difficulty as string,
      dietaryTags: Array.isArray(req.query.dietaryTags) ? req.query.dietaryTags as string[] : req.query.dietaryTags as string,
      search: req.query.search as string
    };
    
    const recipes = await recipeService.getRecipes(req.user.householdId, filters);
    res.json(recipes);
  } catch (error) {
    console.error('Recipes fetch error:', error);
    res.status(500).json({ message: 'Server error fetching recipes' });
  }
});

// Get recipe by ID
router.get('/:id', authenticateToken, validate(recipeParamsSchema), async (req: AuthRequest, res) => {
  try {
    const recipe = await recipeService.getRecipeById(req.user.householdId, req.params.id);
    res.json(recipe);
  } catch (error) {
    console.error('Recipe fetch error:', error);
    if (error instanceof Error && error.message === 'Recipe not found') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
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
router.post('/', authenticateToken, requireAdmin, validate(createRecipeSchema), async (req: AuthRequest, res) => {
  try {
    const recipe = await recipeService.createRecipe(
      req.user.householdId,
      req.user._id,
      req.body
    );

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
router.put('/:id', authenticateToken, requireAdmin, validate(updateRecipeSchema), async (req: AuthRequest, res) => {
  try {
    const recipe = await recipeService.updateRecipe(
      req.user.householdId,
      req.params.id,
      req.body
    );

    res.json({
      message: 'Recipe updated successfully',
      recipe
    });
  } catch (error) {
    console.error('Recipe update error:', error);
    if (error instanceof Error && error.message === 'Recipe not found') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(500).json({ message: 'Server error updating recipe' });
  }
});

// Delete recipe (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, validate(recipeParamsSchema), async (req: AuthRequest, res) => {
  try {
    const recipe = await recipeService.deleteRecipe(
      req.user.householdId,
      req.params.id
    );

    res.json({
      message: 'Recipe deleted successfully',
      recipe
    });
  } catch (error) {
    console.error('Recipe deletion error:', error);
    if (error instanceof Error && error.message === 'Recipe not found') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(500).json({ message: 'Server error deleting recipe' });
  }
});

// Get recipe metadata for filtering
router.get('/meta/categories', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const metadata = await recipeService.getRecipeMetadata(req.user.householdId);
    res.json(metadata);
  } catch (error) {
    console.error('Recipe metadata error:', error);
    res.status(500).json({ message: 'Server error fetching recipe metadata' });
  }
});

export default router;
