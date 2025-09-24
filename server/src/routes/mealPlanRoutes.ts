import express from 'express';
import MealPlan from '../models/MealPlan';
import Recipe from '../models/Recipe';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get meal plans for household
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { weekStartDate } = req.query;
    
    let filter: any = { 
      householdId: req.user.householdId,
      isActive: true 
    };
    
    if (weekStartDate) {
      const startDate = new Date(weekStartDate as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
      
      filter.weekStartDate = { $gte: startDate, $lt: endDate };
    }

    const mealPlans = await MealPlan.find(filter).sort({ weekStartDate: -1 });
    res.json(mealPlans);
  } catch (error) {
    console.error('Meal plans fetch error:', error);
    res.status(500).json({ message: 'Server error fetching meal plans' });
  }
});

// Get current active meal plan
router.get('/current', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const mealPlan = await MealPlan.findOne({
      householdId: req.user.householdId,
      isActive: true,
      weekStartDate: { $lte: startOfWeek },
      weekEndDate: { $gte: startOfWeek }
    });

    if (!mealPlan) {
      return res.json({ message: 'No active meal plan found', mealPlan: null });
    }

    res.json(mealPlan);
  } catch (error) {
    console.error('Current meal plan fetch error:', error);
    res.status(500).json({ message: 'Server error fetching current meal plan' });
  }
});

// Generate new meal plan
router.post('/generate', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { weekStartDate, preferences } = req.body;
    
    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    // Get available recipes for the household
    const recipeFilter: any = { 
      householdId: req.user.householdId,
      isShared: true 
    };

    // Apply dietary restrictions if provided
    if (preferences?.dietaryRestrictions?.length > 0) {
      recipeFilter['metadata.dietaryTags'] = { 
        $in: preferences.dietaryRestrictions 
      };
    }

    const availableRecipes = await Recipe.find(recipeFilter);
    
    if (availableRecipes.length === 0) {
      return res.status(400).json({ 
        message: 'No recipes available for meal planning' 
      });
    }

    // Generate meal plan
    const meals = [];
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      
      for (const mealType of mealTypes) {
        // Skip snack for some days or adjust based on preferences
        if (mealType === 'snack' && Math.random() < 0.5) continue;
        
        // Select random recipe for this meal type
        const categoryRecipes = availableRecipes.filter(recipe => 
          recipe.metadata.category === mealType
        );
        
        if (categoryRecipes.length > 0) {
          const randomRecipe = categoryRecipes[Math.floor(Math.random() * categoryRecipes.length)];
          
          meals.push({
            date: currentDate,
            mealType,
            recipeId: randomRecipe._id,
            recipeName: randomRecipe.name,
            servings: 2, // Default servings
            notes: ''
          });
        }
      }
    }

    // Deactivate previous meal plans
    await MealPlan.updateMany(
      { householdId: req.user.householdId, isActive: true },
      { isActive: false }
    );

    // Create new meal plan
    const mealPlan = new MealPlan({
      householdId: req.user.householdId,
      weekStartDate: startDate,
      weekEndDate: endDate,
      meals,
      preferences: preferences || {},
      createdBy: req.user._id
    });

    await mealPlan.save();

    res.status(201).json({
      message: 'Meal plan generated successfully',
      mealPlan
    });
  } catch (error) {
    console.error('Meal plan generation error:', error);
    res.status(500).json({ message: 'Server error generating meal plan' });
  }
});

// Update meal plan
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndUpdate(
      { 
        _id: req.params.id,
        householdId: req.user.householdId 
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.json({
      message: 'Meal plan updated successfully',
      mealPlan
    });
  } catch (error) {
    console.error('Meal plan update error:', error);
    res.status(500).json({ message: 'Server error updating meal plan' });
  }
});

// Delete meal plan
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndUpdate(
      { 
        _id: req.params.id,
        householdId: req.user.householdId 
      },
      { isActive: false },
      { new: true }
    );

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.json({
      message: 'Meal plan deleted successfully',
      mealPlan
    });
  } catch (error) {
    console.error('Meal plan deletion error:', error);
    res.status(500).json({ message: 'Server error deleting meal plan' });
  }
});

// Get grocery list for meal plan
router.get('/:id/grocery-list', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      householdId: req.user.householdId
    });

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Get all recipes used in the meal plan
    const recipeIds = mealPlan.meals.map(meal => meal.recipeId);
    const recipes = await Recipe.find({ _id: { $in: recipeIds } });

    // Aggregate ingredients
    const ingredientMap = new Map();
    
    mealPlan.meals.forEach(meal => {
      const recipe = recipes.find(r => r._id.toString() === meal.recipeId);
      if (recipe) {
        recipe.ingredients.forEach(ingredient => {
          const key = `${ingredient.name.toLowerCase()}_${ingredient.unit}`;
          const quantity = ingredient.quantity * meal.servings;
          
          if (ingredientMap.has(key)) {
            ingredientMap.get(key).quantity += quantity;
          } else {
            ingredientMap.set(key, {
              name: ingredient.name,
              quantity,
              unit: ingredient.unit,
              notes: ingredient.notes
            });
          }
        });
      }
    });

    const groceryList = Array.from(ingredientMap.values());

    res.json({
      mealPlan: {
        weekStartDate: mealPlan.weekStartDate,
        weekEndDate: mealPlan.weekEndDate
      },
      groceryList
    });
  } catch (error) {
    console.error('Grocery list generation error:', error);
    res.status(500).json({ message: 'Server error generating grocery list' });
  }
});

export default router;
