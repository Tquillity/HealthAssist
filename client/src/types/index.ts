// User types
export interface User {
  id: string;
  username: string;
  email: string;
  householdId: string;
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    timezone: string;
  };
  preferences: {
    energy: 'low' | 'medium' | 'high';
    preferredContext: 'morning' | 'evening' | 'anytime';
    routineDuration: '5min' | '15min' | '30min' | '60min';
    dietaryRestrictions: string[];
    healthGoals: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Routine types
export interface Routine {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'breathwork' | 'meditation' | 'exercise' | 'stretching' | 'mindfulness' | 'sleep' | 'energy';
  metadata: {
    context: 'morning' | 'evening' | 'anytime';
    energy: 'low' | 'medium' | 'high';
    duration: '5min' | '15min' | '30min' | '60min';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    equipment: string[];
    tags: string[];
  };
  instructions: {
    steps: Array<{
      step: number;
      title: string;
      description: string;
      duration?: string;
      imageUrl?: string;
    }>;
    tips: string[];
    contraindications: string[];
  };
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Recipe types
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  perServing: boolean;
}

export interface Recipe {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  metadata: {
    category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'beverage';
    cuisine: string;
    difficulty: 'easy' | 'medium' | 'hard';
    prepTime: number;
    cookTime: number;
    servings: number;
    tags: string[];
    dietaryTags: string[];
  };
  isShared: boolean;
  householdId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Meal Plan types
export interface MealPlanItem {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId: string;
  recipeName: string;
  servings: number;
  notes?: string;
}

export interface MealPlan {
  _id: string;
  householdId: string;
  weekStartDate: string;
  weekEndDate: string;
  meals: MealPlanItem[];
  preferences: {
    dietaryRestrictions: string[];
    healthGoals: string[];
    cuisinePreferences: string[];
    avoidIngredients: string[];
  };
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Filter types
export interface RoutineFilters {
  category?: string;
  context?: string;
  energy?: string;
  duration?: string;
  difficulty?: string;
}

export interface RecipeFilters {
  category?: string;
  difficulty?: string;
  dietaryTags?: string[];
  search?: string;
}

export interface LotteryRequest {
  count?: number;
  category?: string;
  context?: string;
  energy?: string;
  duration?: string;
  difficulty?: string;
  excludeIds?: string[];
}
