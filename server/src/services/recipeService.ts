import Recipe from '../models/Recipe';

export interface RecipeFilters {
  category?: string;
  difficulty?: string;
  dietaryTags?: string | string[];
  search?: string;
}

export interface RecipeMetadata {
  categories: string[];
  difficulties: string[];
  dietaryTags: string[];
  cuisines: string[];
}

// Get all recipes for household
export const getRecipes = async (householdId: string, filters: RecipeFilters) => {
  const { category, difficulty, dietaryTags, search } = filters;
  
  const filter: any = { 
    householdId,
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
  return recipes;
};

// Get recipe by ID
export const getRecipeById = async (householdId: string, recipeId: string) => {
  const recipe = await Recipe.findOne({ 
    _id: recipeId,
    householdId 
  });
  
  if (!recipe) {
    throw new Error('Recipe not found');
  }

  return recipe;
};

// Create new recipe
export const createRecipe = async (householdId: string, userId: string, data: any) => {
  const recipeData = {
    ...data,
    householdId,
    createdBy: userId
  };

  const recipe = new Recipe(recipeData);
  await recipe.save();

  return recipe;
};

// Update recipe
export const updateRecipe = async (householdId: string, recipeId: string, data: any) => {
  const recipe = await Recipe.findOneAndUpdate(
    { 
      _id: recipeId,
      householdId 
    },
    data,
    { new: true, runValidators: true }
  );

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  return recipe;
};

// Delete recipe
export const deleteRecipe = async (householdId: string, recipeId: string) => {
  const recipe = await Recipe.findOneAndDelete({
    _id: recipeId,
    householdId
  });

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  return recipe;
};

// Get recipe metadata for filtering
export const getRecipeMetadata = async (householdId: string): Promise<RecipeMetadata> => {
  const categories = await Recipe.distinct('metadata.category', { 
    householdId,
    isShared: true 
  });
  const difficulties = await Recipe.distinct('metadata.difficulty', { 
    householdId,
    isShared: true 
  });
  const dietaryTags = await Recipe.distinct('metadata.dietaryTags', { 
    householdId,
    isShared: true 
  });
  const cuisines = await Recipe.distinct('metadata.cuisine', { 
    householdId,
    isShared: true 
  });

  return {
    categories,
    difficulties,
    dietaryTags,
    cuisines
  };
};
