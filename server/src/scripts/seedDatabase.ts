import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Routine from '../models/Routine';
import Recipe from '../models/Recipe';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/HA';

// Sample routines data
const sampleRoutines = [
  {
    title: "Morning Breathwork",
    description: "Start your day with energizing breathwork to boost energy and focus",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    category: "breathwork" as const,
    metadata: {
      context: "morning" as const,
      energy: "high" as const,
      duration: "5min" as const,
      difficulty: "beginner" as const,
      equipment: [],
      tags: ["energy", "focus", "morning"]
    },
    instructions: {
      steps: [
        {
          step: 1,
          title: "Find Comfortable Position",
          description: "Sit or stand comfortably with spine straight",
          duration: "30 seconds"
        },
        {
          step: 2,
          title: "Deep Breathing",
          description: "Take 10 deep breaths, inhaling for 4 counts, exhaling for 4 counts",
          duration: "2 minutes"
        },
        {
          step: 3,
          title: "Energizing Breaths",
          description: "Take 5 quick, sharp inhales through nose, then one long exhale",
          duration: "1 minute"
        }
      ],
      tips: [
        "Keep shoulders relaxed",
        "Focus on the breath",
        "If you feel lightheaded, slow down"
      ],
      contraindications: [
        "Not recommended if you have respiratory issues"
      ]
    },
    isActive: true,
    createdBy: "system"
  },
  {
    title: "Evening Meditation",
    description: "Calming meditation to wind down and prepare for restful sleep",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    category: "meditation" as const,
    metadata: {
      context: "evening" as const,
      energy: "low" as const,
      duration: "15min" as const,
      difficulty: "beginner" as const,
      equipment: [],
      tags: ["sleep", "calm", "evening", "mindfulness"]
    },
    instructions: {
      steps: [
        {
          step: 1,
          title: "Prepare Space",
          description: "Find a quiet, comfortable space with dim lighting",
          duration: "1 minute"
        },
        {
          step: 2,
          title: "Body Scan",
          description: "Slowly scan your body from head to toe, releasing tension",
          duration: "5 minutes"
        },
        {
          step: 3,
          title: "Mindful Breathing",
          description: "Focus on your breath, letting thoughts pass without judgment",
          duration: "8 minutes"
        },
        {
          step: 4,
          title: "Gratitude",
          description: "Think of three things you're grateful for today",
          duration: "1 minute"
        }
      ],
      tips: [
        "Use a meditation app if helpful",
        "Don't worry if your mind wanders",
        "Consistency is more important than perfection"
      ],
      contraindications: []
    },
    isActive: true,
    createdBy: "system"
  },
  {
    title: "Quick Energy Boost",
    description: "5-minute routine to increase energy and alertness",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    category: "exercise" as const,
    metadata: {
      context: "anytime" as const,
      energy: "high" as const,
      duration: "5min" as const,
      difficulty: "beginner" as const,
      equipment: [],
      tags: ["energy", "quick", "movement"]
    },
    instructions: {
      steps: [
        {
          step: 1,
          title: "Jumping Jacks",
          description: "30 jumping jacks to get blood flowing",
          duration: "1 minute"
        },
        {
          step: 2,
          title: "Arm Circles",
          description: "Large arm circles forward and backward",
          duration: "1 minute"
        },
        {
          step: 3,
          title: "Squats",
          description: "15 bodyweight squats",
          duration: "1 minute"
        },
        {
          step: 4,
          title: "Stretching",
          description: "Reach arms overhead and stretch side to side",
          duration: "2 minutes"
        }
      ],
      tips: [
        "Modify intensity based on your energy level",
        "Focus on form over speed",
        "Listen to your body"
      ],
      contraindications: [
        "Not recommended if you have joint issues"
      ]
    },
    isActive: true,
    createdBy: "system"
  }
];

// Sample recipes data
const sampleRecipes = [
  {
    name: "Green Smoothie Bowl",
    description: "Nutritious and energizing smoothie bowl perfect for breakfast",
    imageUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400",
    ingredients: [
      { name: "Banana", quantity: 1, unit: "medium" },
      { name: "Spinach", quantity: 1, unit: "cup" },
      { name: "Almond milk", quantity: 1, unit: "cup" },
      { name: "Chia seeds", quantity: 1, unit: "tbsp" },
      { name: "Honey", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Add all ingredients to blender",
      "Blend until smooth and creamy",
      "Pour into bowl and add toppings",
      "Serve immediately"
    ],
    nutrition: {
      calories: 250,
      protein: 8,
      carbs: 45,
      fat: 6,
      fiber: 12,
      sugar: 28,
      sodium: 120,
      perServing: true
    },
    metadata: {
      category: "breakfast" as const,
      cuisine: "Healthy",
      difficulty: "easy" as const,
      prepTime: 5,
      cookTime: 0,
      servings: 1,
      tags: ["healthy", "quick", "vegetarian"],
      dietaryTags: ["vegetarian", "gluten-free"]
    },
    isShared: true,
    householdId: "sample_household",
    createdBy: "system"
  },
  {
    name: "Mediterranean Quinoa Bowl",
    description: "Protein-rich quinoa bowl with fresh vegetables and herbs",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    ingredients: [
      { name: "Quinoa", quantity: 1, unit: "cup" },
      { name: "Cherry tomatoes", quantity: 1, unit: "cup" },
      { name: "Cucumber", quantity: 1, unit: "medium" },
      { name: "Red onion", quantity: 0.25, unit: "cup" },
      { name: "Feta cheese", quantity: 0.5, unit: "cup" },
      { name: "Olive oil", quantity: 2, unit: "tbsp" },
      { name: "Lemon juice", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Cook quinoa according to package instructions",
      "Dice cucumber and slice cherry tomatoes",
      "Thinly slice red onion",
      "Mix all vegetables with cooked quinoa",
      "Drizzle with olive oil and lemon juice",
      "Top with feta cheese and serve"
    ],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 10,
      fiber: 6,
      sugar: 8,
      sodium: 280,
      perServing: true
    },
    metadata: {
      category: "lunch" as const,
      cuisine: "Mediterranean",
      difficulty: "easy" as const,
      prepTime: 15,
      cookTime: 15,
      servings: 2,
      tags: ["healthy", "protein", "vegetarian"],
      dietaryTags: ["vegetarian", "gluten-free"]
    },
    isShared: true,
    householdId: "sample_household",
    createdBy: "system"
  },
  {
    name: "Grilled Salmon with Roasted Vegetables",
    description: "Healthy and flavorful salmon with seasonal roasted vegetables",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    ingredients: [
      { name: "Salmon fillet", quantity: 4, unit: "oz" },
      { name: "Broccoli", quantity: 1, unit: "cup" },
      { name: "Sweet potato", quantity: 1, unit: "medium" },
      { name: "Olive oil", quantity: 2, unit: "tbsp" },
      { name: "Garlic", quantity: 2, unit: "clove" },
      { name: "Lemon", quantity: 0.5, unit: "piece" },
      { name: "Salt", quantity: 0.5, unit: "tsp" },
      { name: "Black pepper", quantity: 0.25, unit: "tsp" }
    ],
    instructions: [
      "Preheat oven to 400°F (200°C)",
      "Cut sweet potato into cubes and broccoli into florets",
      "Toss vegetables with olive oil, garlic, salt, and pepper",
      "Roast vegetables for 20-25 minutes until tender",
      "Season salmon with salt, pepper, and lemon juice",
      "Grill salmon for 4-5 minutes per side",
      "Serve salmon over roasted vegetables"
    ],
    nutrition: {
      calories: 420,
      protein: 35,
      carbs: 25,
      fat: 18,
      fiber: 6,
      sugar: 8,
      sodium: 450,
      perServing: true
    },
    metadata: {
      category: "dinner" as const,
      cuisine: "American",
      difficulty: "medium" as const,
      prepTime: 15,
      cookTime: 30,
      servings: 1,
      tags: ["healthy", "protein", "omega-3"],
      dietaryTags: ["gluten-free", "dairy-free"]
    },
    isShared: true,
    householdId: "sample_household",
    createdBy: "system"
  },
  {
    name: "Overnight Oats",
    description: "Creamy and nutritious overnight oats perfect for busy mornings",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    ingredients: [
      { name: "Rolled oats", quantity: 0.5, unit: "cup" },
      { name: "Greek yogurt", quantity: 0.25, unit: "cup" },
      { name: "Almond milk", quantity: 0.5, unit: "cup" },
      { name: "Chia seeds", quantity: 1, unit: "tbsp" },
      { name: "Honey", quantity: 1, unit: "tbsp" },
      { name: "Berries", quantity: 0.5, unit: "cup" },
      { name: "Almonds", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Mix oats, chia seeds, and yogurt in a jar",
      "Add almond milk and honey, stir well",
      "Cover and refrigerate overnight",
      "In the morning, top with berries and almonds",
      "Serve cold or at room temperature"
    ],
    nutrition: {
      calories: 320,
      protein: 15,
      carbs: 45,
      fat: 8,
      fiber: 10,
      sugar: 20,
      sodium: 80,
      perServing: true
    },
    metadata: {
      category: "breakfast" as const,
      cuisine: "Healthy",
      difficulty: "easy" as const,
      prepTime: 10,
      cookTime: 0,
      servings: 1,
      tags: ["healthy", "make-ahead", "fiber"],
      dietaryTags: ["vegetarian", "gluten-free"]
    },
    isShared: true,
    householdId: "sample_household",
    createdBy: "system"
  },
  {
    name: "Vegetable Stir Fry",
    description: "Quick and colorful vegetable stir fry with tofu",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
    ingredients: [
      { name: "Tofu", quantity: 8, unit: "oz" },
      { name: "Bell peppers", quantity: 2, unit: "medium" },
      { name: "Broccoli", quantity: 1, unit: "cup" },
      { name: "Carrots", quantity: 2, unit: "medium" },
      { name: "Soy sauce", quantity: 3, unit: "tbsp" },
      { name: "Sesame oil", quantity: 1, unit: "tbsp" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" },
      { name: "Rice", quantity: 1, unit: "cup" }
    ],
    instructions: [
      "Press and cube tofu, then pan-fry until golden",
      "Cut all vegetables into bite-sized pieces",
      "Heat sesame oil in a large wok or pan",
      "Add garlic and ginger, stir for 30 seconds",
      "Add vegetables and stir-fry for 5-7 minutes",
      "Add tofu and soy sauce, cook for 2 more minutes",
      "Serve over cooked rice"
    ],
    nutrition: {
      calories: 380,
      protein: 20,
      carbs: 45,
      fat: 12,
      fiber: 8,
      sugar: 12,
      sodium: 800,
      perServing: true
    },
    metadata: {
      category: "dinner" as const,
      cuisine: "Asian",
      difficulty: "easy" as const,
      prepTime: 15,
      cookTime: 15,
      servings: 2,
      tags: ["healthy", "vegetarian", "quick"],
      dietaryTags: ["vegetarian", "vegan", "gluten-free"]
    },
    isShared: true,
    householdId: "sample_household",
    createdBy: "system"
  },
  {
    name: "Greek Yogurt Parfait",
    description: "Layered parfait with Greek yogurt, granola, and fresh berries",
    imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
    ingredients: [
      { name: "Greek yogurt", quantity: 1, unit: "cup" },
      { name: "Granola", quantity: 0.25, unit: "cup" },
      { name: "Mixed berries", quantity: 0.5, unit: "cup" },
      { name: "Honey", quantity: 1, unit: "tbsp" },
      { name: "Almonds", quantity: 1, unit: "tbsp" },
      { name: "Chia seeds", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Layer half the yogurt in a glass or bowl",
      "Add half the berries and drizzle with honey",
      "Sprinkle with half the granola and chia seeds",
      "Repeat the layers",
      "Top with almonds and serve immediately"
    ],
    nutrition: {
      calories: 280,
      protein: 18,
      carbs: 35,
      fat: 8,
      fiber: 6,
      sugar: 25,
      sodium: 120,
      perServing: true
    },
    metadata: {
      category: "snack" as const,
      cuisine: "Healthy",
      difficulty: "easy" as const,
      prepTime: 5,
      cookTime: 0,
      servings: 1,
      tags: ["healthy", "protein", "quick"],
      dietaryTags: ["vegetarian", "gluten-free"]
    },
    isShared: true,
    householdId: "sample_household",
    createdBy: "system"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Routine.deleteMany({});
    await Recipe.deleteMany({});
    console.log('Cleared existing data');

    // Create sample routines
    const routines = await Routine.insertMany(sampleRoutines);
    console.log(`Created ${routines.length} routines`);

    // Create sample recipes
    const recipes = await Recipe.insertMany(sampleRecipes);
    console.log(`Created ${recipes.length} recipes`);

    // Create a sample user for testing
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const sampleUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        householdId: 'sample_household',
        profile: {
          firstName: 'Test',
          lastName: 'User',
          timezone: 'UTC'
        },
        preferences: {
          energy: 'medium',
          preferredContext: 'anytime',
          routineDuration: '15min',
          dietaryRestrictions: [],
          healthGoals: ['energy', 'sleep']
        }
      });
      await sampleUser.save();
      console.log('Created sample user: test@example.com / password123');
    }

    console.log('Database seeding completed successfully!');
    console.log('\nSample user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase();