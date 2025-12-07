import mongoose, { Document, Schema } from 'mongoose';

export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface INutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  perServing: boolean;
}

export interface IRecipe extends Document {
  name: string;
  description: string;
  imageUrl: string;
  ingredients: IIngredient[];
  instructions: string[];
  nutrition: INutritionInfo;
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
    prepTime: number; // in minutes
    cookTime: number; // in minutes
    servings: number;
    tags: string[];
    dietaryTags: string[]; // e.g., 'vegetarian', 'vegan', 'gluten-free'
  };
  isShared: boolean;
  householdId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
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

const RecipeSchema = new Schema<IRecipe>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        unit: {
          type: String,
          required: true,
          trim: true,
        },
        notes: {
          type: String,
          trim: true,
        },
      },
    ],
    instructions: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    nutrition: {
      calories: {
        type: Number,
        required: true,
        min: 0,
      },
      protein: {
        type: Number,
        required: true,
        min: 0,
      },
      carbs: {
        type: Number,
        required: true,
        min: 0,
      },
      fat: {
        type: Number,
        required: true,
        min: 0,
      },
      fiber: {
        type: Number,
        default: 0,
        min: 0,
      },
      sugar: {
        type: Number,
        default: 0,
        min: 0,
      },
      sodium: {
        type: Number,
        default: 0,
        min: 0,
      },
      perServing: {
        type: Boolean,
        default: true,
      },
    },
    metadata: {
      category: {
        type: String,
        required: true,
        enum: [
          'breakfast',
          'lunch',
          'dinner',
          'snack',
          'dessert',
          'beverage',
          'sauce',
        ],
      },
      cuisine: {
        type: String,
        trim: true,
      },
      difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard'],
      },
      prepTime: {
        type: Number,
        required: true,
        min: 0,
      },
      cookTime: {
        type: Number,
        required: true,
        min: 0,
      },
      servings: {
        type: Number,
        required: true,
        min: 1,
      },
      tags: [
        {
          type: String,
          trim: true,
        },
      ],
      dietaryTags: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    isShared: {
      type: Boolean,
      default: true,
    },
    householdId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    yield: {
      amount: Number,
      unit: String,
    },
    leanInfo: {
      batchEfficiency: { type: String, enum: ['High', 'Medium', 'Low'] },
      activeWorkTime: Number,
      passiveTime: Number,
      leanRole: {
        type: String,
        enum: ['Infrastructure', 'Process', 'Daily', 'Treat'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
RecipeSchema.index({ householdId: 1, isShared: 1 });
RecipeSchema.index({ 'metadata.category': 1, 'metadata.difficulty': 1 });
RecipeSchema.index({ 'metadata.dietaryTags': 1 });

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);
