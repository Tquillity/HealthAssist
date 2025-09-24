import mongoose, { Document, Schema } from 'mongoose';

export interface IMealPlanItem {
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId: string;
  recipeName: string;
  servings: number;
  notes?: string;
}

export interface IMealPlan extends Document {
  householdId: string;
  weekStartDate: Date;
  weekEndDate: Date;
  meals: IMealPlanItem[];
  preferences: {
    dietaryRestrictions: string[];
    healthGoals: string[];
    cuisinePreferences: string[];
    avoidIngredients: string[];
  };
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const MealPlanSchema = new Schema<IMealPlan>({
  householdId: {
    type: String,
    required: true
  },
  weekStartDate: {
    type: Date,
    required: true
  },
  weekEndDate: {
    type: Date,
    required: true
  },
  meals: [{
    date: {
      type: Date,
      required: true
    },
    mealType: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'dinner', 'snack']
    },
    recipeId: {
      type: String,
      required: true
    },
    recipeName: {
      type: String,
      required: true,
      trim: true
    },
    servings: {
      type: Number,
      required: true,
      min: 1
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  preferences: {
    dietaryRestrictions: [{
      type: String,
      trim: true
    }],
    healthGoals: [{
      type: String,
      trim: true
    }],
    cuisinePreferences: [{
      type: String,
      trim: true
    }],
    avoidIngredients: [{
      type: String,
      trim: true
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
MealPlanSchema.index({ householdId: 1, weekStartDate: 1, isActive: 1 });
MealPlanSchema.index({ 'meals.date': 1 });

export default mongoose.model<IMealPlan>('MealPlan', MealPlanSchema);
