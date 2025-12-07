import express from 'express';
import * as mealPlanService from '../services/mealPlanService';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router: express.Router = express.Router();

// Get meal plans for household
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const filters = {
      weekStartDate: req.query.weekStartDate as string,
    };

    const mealPlans = await mealPlanService.getMealPlans(
      req.user.householdId,
      filters
    );
    res.json(mealPlans);
  } catch (error) {
    console.error('Meal plans fetch error:', error);
    res.status(500).json({ message: 'Server error fetching meal plans' });
  }
});

// Get current active meal plan
router.get('/current', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const mealPlan = await mealPlanService.getCurrentMealPlan(
      req.user.householdId
    );

    if (!mealPlan) {
      return res.json({ message: 'No active meal plan found', mealPlan: null });
    }

    res.json(mealPlan);
  } catch (error) {
    console.error('Current meal plan fetch error:', error);
    res
      .status(500)
      .json({ message: 'Server error fetching current meal plan' });
  }
});

// Generate new meal plan
router.post('/generate', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const data = {
      weekStartDate: req.body.weekStartDate,
      preferences: req.body.preferences,
    };

    const mealPlan = await mealPlanService.generateNewMealPlan(
      req.user.householdId,
      req.user._id,
      data
    );

    res.status(201).json({
      message: 'Meal plan generated successfully',
      mealPlan,
    });
  } catch (error) {
    console.error('Meal plan generation error:', error);
    if (
      error instanceof Error &&
      error.message === 'No recipes available for meal planning'
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error generating meal plan' });
  }
});

// Update meal plan
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const mealPlan = await mealPlanService.updateMealPlan(
      req.user.householdId,
      req.params.id,
      req.body
    );

    res.json({
      message: 'Meal plan updated successfully',
      mealPlan,
    });
  } catch (error) {
    console.error('Meal plan update error:', error);
    if (error instanceof Error && error.message === 'Meal plan not found') {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.status(500).json({ message: 'Server error updating meal plan' });
  }
});

// Delete meal plan
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const mealPlan = await mealPlanService.deleteMealPlan(
      req.user.householdId,
      req.params.id
    );

    res.json({
      message: 'Meal plan deleted successfully',
      mealPlan,
    });
  } catch (error) {
    console.error('Meal plan deletion error:', error);
    if (error instanceof Error && error.message === 'Meal plan not found') {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.status(500).json({ message: 'Server error deleting meal plan' });
  }
});

// Get grocery list for meal plan
router.get(
  '/:id/grocery-list',
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const result = await mealPlanService.getGroceryList(
        req.user.householdId,
        req.params.id
      );

      res.json(result);
    } catch (error) {
      console.error('Grocery list generation error:', error);
      if (error instanceof Error && error.message === 'Meal plan not found') {
        return res.status(404).json({ message: 'Meal plan not found' });
      }
      res.status(500).json({ message: 'Server error generating grocery list' });
    }
  }
);

export default router;
