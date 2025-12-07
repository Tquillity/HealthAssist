// API Request/Response types
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  householdId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  timezone?: string;
  energy?: 'low' | 'medium' | 'high';
  preferredContext?: 'morning' | 'evening' | 'anytime';
  routineDuration?: '5min' | '15min' | '30min' | '60min';
  dietaryRestrictions?: string[];
  healthGoals?: string[];
}

export interface RoutineFilters {
  category?: string;
  difficulty?: string;
  duration?: string;
  tags?: string[];
  context?: string;
  energy?: string;
  excludeIds?: string[];
}

export interface LotteryRequest {
  filters: RoutineFilters;
  count: number;
}

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  householdId: string;
  role: 'admin' | 'user';
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
  category:
    | 'breathwork'
    | 'meditation'
    | 'exercise'
    | 'stretching'
    | 'mindfulness'
    | 'sleep'
    | 'energy';
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
    category:
      | 'breakfast'
      | 'lunch'
      | 'dinner'
      | 'snack'
      | 'dessert'
      | 'beverage';
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
  yield?: {
    amount: number;
    unit: string;
  };
  leanInfo?: {
    batchEfficiency: 'High' | 'Medium' | 'Low';
    activeWorkTime: number;
    passiveTime: number;
    leanRole: 'Infrastructure' | 'Process' | 'Daily' | 'Treat';
  };
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

export interface LotteryFilters {
  category?: string;
  context?: string;
  energy?: string;
  duration?: string;
  difficulty?: string;
  excludeIds?: string[];
}

// Journal Entry types
export interface JournalEntry {
  _id: string;
  userId: string;
  date: string;
  mood: {
    rating: number;
    notes?: string;
    emotions: string[];
  };
  energy: {
    rating: number;
    notes?: string;
    factors: string[];
  };
  sleep: {
    hours: number;
    quality: number;
    notes?: string;
  };
  exercise: {
    duration: number;
    type: string;
    intensity: number;
    notes?: string;
  };
  nutrition: {
    meals: number;
    water: number;
    notes?: string;
  };
  stress: {
    rating: number;
    sources: string[];
    copingStrategies: string[];
    notes?: string;
  };
  gratitude: {
    entries: string[];
    notes?: string;
  };
  goals: {
    achieved: string[];
    progress: string[];
    notes?: string;
  };
  symptoms: {
    physical: string[];
    mental: string[];
    notes?: string;
  };
  isPrivate: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalAnalytics {
  mood: {
    average: number;
    trend: number;
    distribution: {
      high: number;
      medium: number;
      low: number;
    };
  };
  energy: {
    average: number;
    trend: number;
    distribution: {
      high: number;
      medium: number;
      low: number;
    };
  };
  sleep: {
    averageHours: number;
    averageQuality: number;
  };
  exercise: {
    totalMinutes: number;
    averageIntensity: number;
    daysActive: number;
  };
  stress: {
    average: number;
    commonSources: Record<string, number>;
  };
  gratitude: {
    totalEntries: number;
    averagePerDay: number;
  };
}

// Educational Resource types
export interface EducationalResource {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category:
    | 'nutrition'
    | 'exercise'
    | 'mental-health'
    | 'sleep'
    | 'wellness'
    | 'meditation'
    | 'stress-management'
    | 'hormones'
    | 'recipes'
    | 'lifestyle';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  author: string;
  imageUrl?: string;
  videoUrl?: string;
  externalUrl?: string;
  isExternal: boolean;
  isActive: boolean;
  featured: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EducationalResourceFilters {
  category?: string;
  difficulty?: string;
  tags?: string[];
  featured?: boolean;
  search?: string;
}
