import MealPlan from '../models/MealPlan';
import Recipe from '../models/Recipe';

export interface MealPlanFilters {
  weekStartDate?: string;
}

export interface MealPlanPreferences {
  dietaryRestrictions?: string[];
}

export interface MealPlanGenerationData {
  weekStartDate: string;
  preferences?: MealPlanPreferences;
}

export interface Meal {
  date: Date;
  mealType: string;
  recipeId: string;
  recipeName: string;
  servings: number;
  notes: string;
}

export interface GroceryListItem {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface GroceryListResponse {
  mealPlan: {
    weekStartDate: Date;
    weekEndDate: Date;
  };
  groceryList: GroceryListItem[];
}

// Get meal plans for household
export const getMealPlans = async (householdId: string, filters: MealPlanFilters) => {
  const { weekStartDate } = filters;
  
  let filter: any = { 
    householdId,
    isActive: true 
  };
  
  if (weekStartDate) {
    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    
    filter.weekStartDate = { $gte: startDate, $lt: endDate };
  }

  const mealPlans = await MealPlan.find(filter).sort({ weekStartDate: -1 });
  return mealPlans;
};

// Get current active meal plan
export const getCurrentMealPlan = async (householdId: string) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const mealPlan = await MealPlan.findOne({
    householdId,
    isActive: true,
    weekStartDate: { $lte: startOfWeek },
    weekEndDate: { $gte: startOfWeek }
  });

  return mealPlan;
};

// Generate new meal plan
export const generateNewMealPlan = async (
  householdId: string, 
  userId: string, 
  data: MealPlanGenerationData
) => {
  const { weekStartDate, preferences } = data;
  
  const startDate = new Date(weekStartDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);

  // Get available recipes for the household
  const recipeFilter: any = { 
    householdId,
    isShared: true 
  };

  // Apply dietary restrictions if provided
  if (preferences && preferences.dietaryRestrictions && preferences.dietaryRestrictions.length > 0) {
    recipeFilter['metadata.dietaryTags'] = { 
      $in: preferences.dietaryRestrictions 
    };
  }

  const availableRecipes = await Recipe.find(recipeFilter);
  
  if (availableRecipes.length === 0) {
    throw new Error('No recipes available for meal planning');
  }

  // Generate meal plan
  const meals: Meal[] = [];
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
          recipeId: (randomRecipe._id as any).toString(),
          recipeName: randomRecipe.name,
          servings: 2, // Default servings
          notes: ''
        });
      }
    }
  }

  // Deactivate previous meal plans
  await MealPlan.updateMany(
    { householdId, isActive: true },
    { isActive: false }
  );

  // Create new meal plan
  const mealPlan = new MealPlan({
    householdId,
    weekStartDate: startDate,
    weekEndDate: endDate,
    meals,
    preferences: preferences || {},
    createdBy: userId
  });

  await mealPlan.save();

  return mealPlan;
};

// Update meal plan
export const updateMealPlan = async (householdId: string, mealPlanId: string, data: any) => {
  const mealPlan = await MealPlan.findOneAndUpdate(
    { 
      _id: mealPlanId,
      householdId 
    },
    data,
    { new: true, runValidators: true }
  );

  if (!mealPlan) {
    throw new Error('Meal plan not found');
  }

  return mealPlan;
};

// Delete meal plan (soft delete)
export const deleteMealPlan = async (householdId: string, mealPlanId: string) => {
  const mealPlan = await MealPlan.findOneAndUpdate(
    { 
      _id: mealPlanId,
      householdId 
    },
    { isActive: false },
    { new: true }
  );

  if (!mealPlan) {
    throw new Error('Meal plan not found');
  }

  return mealPlan;
};

// Get grocery list for meal plan
export const getGroceryList = async (householdId: string, mealPlanId: string): Promise<GroceryListResponse> => {
  const mealPlan = await MealPlan.findOne({
    _id: mealPlanId,
    householdId
  });

  if (!mealPlan) {
    throw new Error('Meal plan not found');
  }

  // Get all recipes used in the meal plan
  const recipeIds = mealPlan.meals.map(meal => meal.recipeId);
  const recipes = await Recipe.find({ _id: { $in: recipeIds } });

  // Aggregate ingredients
  const ingredientMap = new Map<string, GroceryListItem>();
  
  mealPlan.meals.forEach(meal => {
    const recipe = recipes.find(r => String(r._id) === meal.recipeId);
    if (recipe) {
      recipe.ingredients.forEach(ingredient => {
        const key = `${ingredient.name.toLowerCase()}_${ingredient.unit}`;
        const quantity = ingredient.quantity * meal.servings;
        
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.quantity += quantity;
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

  return {
    mealPlan: {
      weekStartDate: mealPlan.weekStartDate,
      weekEndDate: mealPlan.weekEndDate
    },
    groceryList
  };
};
